// netlify/functions/affirm-create-checkout.js
// Crea el checkout v2 en Affirm (producción) y devuelve checkout_token / redirect_url

const HDRS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: HDRS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: HDRS, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { items, total, currency = "USD", merchant = {}, shipping = {}, billing = {} } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Items are required" }) };
    }
    if (!Number.isInteger(total)) {
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Total must be an integer number of cents" }) };
    }

    const ENV  = String(process.env.AFFIRM_ENV || "prod").toLowerCase();
    const API  = process.env.AFFIRM_API_BASE || (ENV.startsWith("prod") ? "https://api.affirm.com" : "https://sandbox.affirm.com");
    const SITE = process.env.AFFIRM_SITE_BASE_URL || "https://www.sunrisestore.info";

    const PUB  = process.env.AFFIRM_PUBLIC_KEY;
    const PRIV = process.env.AFFIRM_PRIVATE_KEY;

    console.log("[AFFIRM create] env=", ENV, "api=", API, "pub_len=", (PUB||"").length, "priv_len=", (PRIV||"").length, "site=", SITE);

    if (!PUB || !PRIV) {
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    const orderId = merchant.order_id || `SS-${Date.now()}`;

    // 🔴 IMPORTANTE: incluir merchant.public_api_key
    const checkout = {
      merchant: {
        public_api_key: PUB, // <--- CLAVE PÚBLICA AQUÍ
        user_confirmation_url: merchant.user_confirmation_url || `${SITE}/order-success`,
        user_cancel_url:       merchant.user_cancel_url       || `${SITE}/checkout-canceled`,
        user_confirmation_url_action: "GET",
        name: merchant.name || "Sunrise Store",
      },
      shipping,
      billing,
      items: items.map((it) => ({
        display_name: it.display_name,
        sku: it.sku,
        unit_price: it.unit_price,   // en centavos
        qty: it.qty,
        item_image_url: it.item_image_url, // URLs absolutas https
        item_url: it.item_url,             // URLs absolutas https
      })),
      discounts: {},
      metadata: { platform: "sunrise-store" },
      order_id: orderId,
      currency,
      tax_amount: 0,
      shipping_amount: 0,
      total, // en centavos, debe matchear suma de items
    };

    const resp = await fetch(`${API}/api/v2/checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${PUB}:${PRIV}`).toString("base64"),
      },
      body: JSON.stringify({ checkout }), // Affirm exige el wrapper { checkout: ... }
    });

    const text = await resp.text();
    if (!resp.ok) {
      console.error("[AFFIRM create] status=", resp.status, "body=", text);
      return {
        statusCode: resp.status,
        headers: HDRS,
        body: JSON.stringify({ error: "affirm_error", status: resp.status, affirm: safeParse(text) }),
      };
    }

    const data = safeParse(text);
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
    console.error("[affirm-create] exception", e);
    return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Internal server error" }) };
  }
};

function safeParse(t) { try { return JSON.parse(t); } catch { return { raw: t }; } }
