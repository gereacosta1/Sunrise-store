const HDRS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const abs = (site, url) =>
  /^https?:\/\//i.test(url) ? url : site.replace(/\/+$/, "") + "/" + String(url || "").replace(/^\/+/, "");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: HDRS, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: HDRS, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const body = JSON.parse(event.body || "{}");
    const { items, total, currency = "USD", merchant = {}, shipping = {}, billing = {} } = body;

    if (!Array.isArray(items) || items.length === 0)
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Items are required" }) };
    if (!Number.isInteger(total))
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Total must be integer cents" }) };

    const ENV  = String(process.env.AFFIRM_ENV || "prod").toLowerCase();
    const API  = process.env.AFFIRM_API_BASE || (ENV.startsWith("prod") ? "https://api.affirm.com" : "https://sandbox.affirm.com");
    const SITE = process.env.AFFIRM_SITE_BASE_URL || "https://www.sunrisestore.info";

    const PUB  = process.env.AFFIRM_PUBLIC_KEY;
    const PRIV = process.env.AFFIRM_PRIVATE_KEY;

    console.log(`[AFFIRM] env=${ENV} api=${API} pub_len=${(PUB||"").length} priv_len=${(PRIV||"").length}`);
    if (!PUB || !PRIV) {
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    const orderId = `SS-${Date.now()}`;
    const checkout = {
      merchant: {
        user_confirmation_url: merchant.user_confirmation_url || `${SITE}/orden-exitosa`,
        user_cancel_url:       merchant.user_cancel_url       || `${SITE}/checkout-cancelado`,
        user_confirmation_url_action: "GET",
        name: merchant.name || "Sunrise Store",
      },
      shipping: { name: shipping.name || { first: "Customer", last: "Name" },
                  address: shipping.address || { line1: "123 Main St", city: "Miami", state: "FL", zipcode: "33132", country: "USA" } },
      billing:  { name: billing.name  || { first: "Customer", last: "Name" },
                  address: billing.address  || { line1: "123 Main St", city: "Miami", state: "FL", zipcode: "33132", country: "USA" } },
      items: (items || []).map((it) => ({
        display_name: it.display_name,
        sku: it.sku,
        unit_price: it.unit_price,
        qty: it.qty,
        item_image_url: abs(SITE, it.item_image_url),
        item_url:       abs(SITE, it.item_url),
      })),
      discounts: {},
      metadata: { platform: "sunrise-store", order_id: orderId },
      order_id: orderId,
      currency,
      tax_amount: 0,
      shipping_amount: 0,
      total,
    };

    const res = await fetch(`${API}/api/v2/checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${PUB}:${PRIV}`).toString("base64"),
      },
      body: JSON.stringify({ checkout }),
    });

    const txt = await res.text();
    if (!res.ok) {
      console.error("[Affirm create-checkout] status=", res.status, txt);
      return { statusCode: res.status, headers: HDRS, body: JSON.stringify({ error: "Affirm API error", status: res.status, details: txt }) };
    }

    const data = JSON.parse(txt);
    return { statusCode: 200, headers: HDRS, body: JSON.stringify({ checkout_token: data.checkout_token, redirect_url: data.redirect_url, order_id: orderId }) };
  } catch (e) {
    console.error("Checkout creation error:", e);
    return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
