// netlify/functions/affirm-create-checkout.js

const HDRS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

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

    const ENV  = String(process.env.AFFIRM_ENV || "production").toLowerCase();
    const API  = process.env.AFFIRM_API_BASE || (ENV.startsWith("prod") ? "https://api.affirm.com" : "https://sandbox.affirm.com");
    const SITE = process.env.AFFIRM_SITE_BASE_URL || "https://www.sunrisestore.info";

    const PUB  = process.env.AFFIRM_PUBLIC_KEY;   // (opcional en payload)
    const PRIV = process.env.AFFIRM_PRIVATE_KEY;  // 🔑 se usa sola en Authorization

    console.log("[AFFIRM create]", {
      env: ENV, api: API,
      pub_len: (PUB || "").length,
      priv_len: (PRIV || "").length,
      site: SITE
    });

    if (!PRIV) {
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Server configuration error: missing AFFIRM_PRIVATE_KEY" }) };
    }

    const orderId = `SS-${Date.now()}`;

    const checkout = {
      merchant: {
        user_confirmation_url: merchant.user_confirmation_url || `${SITE}/order-success`,
        user_cancel_url:       merchant.user_cancel_url       || `${SITE}/order-cancel`,
        user_confirmation_url_action: "GET",
        name: merchant.name || "Sunrise Store",
        // ⚠️ Dejar comentado hasta validar claves correctas:
        // public_api_key: PUB
      },
      shipping,
      billing,
      items: items.map((it) => ({
        display_name: it.display_name,
        sku: it.sku,
        unit_price: it.unit_price, // cents
        qty: it.qty,
        item_image_url: it.item_image_url,
        item_url: it.item_url,
      })),
      discounts: {},
      metadata: { platform: "sunrise-store", order_id: orderId },
      order_id: orderId,
      currency,
      tax_amount: 0,
      shipping_amount: 0,
      total, // cents
    };

    const resp = await fetch(`${API}/api/v2/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ SOLO la PRIVATE key como usuario y password vacío:
        Authorization: "Basic " + Buffer.from(`${PRIV}:`).toString("base64"),
      },
      body: JSON.stringify({
    checkout: {
      merchant: {
        user_confirmation_url: merchant.user_confirmation_url || `${SITE}/order-success`,
        user_cancel_url:       merchant.user_cancel_url       || `${SITE}/order-cancel`,
        user_confirmation_url_action: "GET",
        name: merchant.name || "Sunrise Store",
        // ✅ Enviar la public key que MATCH con la private (mismo merchant)
        public_api_key: PUB,
      },
      shipping,
      billing,
      items: items.map(it => ({
        display_name: it.display_name,
        sku: it.sku,
        unit_price: it.unit_price, // cents
        qty: it.qty,
        item_image_url: it.item_image_url,
        item_url: it.item_url,
      })),
      discounts: {},
      metadata: { platform: "sunrise-store", order_id: orderId },
      order_id: orderId,
      currency,
      tax_amount: 0,
      shipping_amount: 0,
      total,
    },
  }),

  
    });

    console.log("[AFFIRM create]", {
  env: ENV, api: API, site: SITE,
  pub_len: (PUB || "").length,
  priv_len: (PRIV || "").length,
  pub_tail: PUB ? PUB.slice(-6) : null,     // último 6 chars
  priv_tail: PRIV ? PRIV.slice(-6) : null,  // último 6 chars
});

    const txt = await resp.text();
    if (!resp.ok) {
      let affirm;
      try { affirm = JSON.parse(txt); } catch { affirm = txt; }
      console.error("[AFFIRM create] status=", resp.status, "body=", affirm);
      return { statusCode: resp.status, headers: HDRS, body: JSON.stringify({ error: "affirm_error", status: resp.status, affirm }) };
    }

    const data = JSON.parse(txt);
    return {
      statusCode: 200,
      headers: HDRS,
      body: JSON.stringify({ checkout_token: data.checkout_token, redirect_url: data.redirect_url, order_id: orderId }),
    };
  } catch (e) {
    console.error("Checkout creation error:", e);
    return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
