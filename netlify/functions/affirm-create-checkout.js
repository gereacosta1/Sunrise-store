// Crea un checkout v2 (producción). Responde {checkout_token, redirect_url, order_id}
const HDRS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: HDRS, body: "" };
  if (event.httpMethod !== "POST")  return { statusCode: 405, headers: HDRS, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const body = JSON.parse(event.body || "{}");
    const { items, total, currency = "USD", merchant = {} } = body;

    if (!Array.isArray(items) || items.length === 0)
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Items are required" }) };
    if (!Number.isInteger(total))
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Total must be integer cents" }) };

    const ENV  = String(process.env.AFFIRM_ENV || "prod").toLowerCase();
    const API  = process.env.AFFIRM_API_BASE || (ENV.startsWith("prod") ? "https://api.affirm.com" : "https://sandbox.affirm.com");
    const SITE = process.env.AFFIRM_SITE_BASE_URL || "https://www.sunrisestore.info";

    const PUB  = process.env.AFFIRM_PUBLIC_KEY;
    const PRIV = process.env.AFFIRM_PRIVATE_KEY;

    console.log('[AFFIRM create] env=prod api=', API,
  'pub_head=', (PUB||'').slice(0,6),
  'priv_head=', (PRIV||'').slice(0,6),
  'site=', site
  ); 

    console.log("[AFFIRM create] env=", ENV, "api=", API, "pub_len=", (PUB||"").length, "priv_len=", (PRIV||"").length, "site=", SITE);
    if (!PUB || !PRIV) {
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    const orderId = `SS-${Date.now()}`;

    const checkout = {
      merchant: {
        user_confirmation_url: merchant.user_confirmation_url || `${SITE}/order-success`,
        user_cancel_url:       merchant.user_cancel_url       || `${SITE}/checkout-canceled`,
        user_confirmation_url_action: "GET",
        name: merchant.name || "Sunrise Store",
      },
      items: items.map((it) => ({
        display_name: it.display_name,
        sku: it.sku,
        unit_price: it.unit_price, // integer (cents)
        qty: it.qty,
        item_image_url: it.item_image_url,
        item_url: it.item_url,
      })),
      order_id: orderId,
      currency,
      tax_amount: 0,
      shipping_amount: 0,
      total, // integer (cents) = suma de items
      metadata: { platform: "sunrise-store", order_id: orderId }
    };

    const AUTH = "Basic " + Buffer.from(`${PUB}:${PRIV}`).toString("base64");

    const res = await fetch(`${API}/api/v2/checkout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: AUTH },
      body: JSON.stringify({ checkout }),
    });

    // Devuelve error de Affirm para depurar rápido
    if (!res.ok) {
      const txt = await res.text();
      console.error("[AFFIRM create] status=", res.status, "body=", txt);
      let aff = null;
      try { aff = JSON.parse(txt); } catch {}
      return { statusCode: res.status, headers: HDRS, body: JSON.stringify({ error: "affirm_error", status: res.status, affirm: aff || txt }) };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: HDRS,
      body: JSON.stringify({
        checkout_token: data.checkout_token,
        redirect_url: data.redirect_url,
        order_id: orderId,
      }),
    };
  } catch (e) {
    console.error("Checkout creation error:", e);
    return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
