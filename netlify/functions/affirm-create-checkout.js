// netlify/functions/affirm-create-checkout.js
// Crea un checkout v2 en Affirm y devuelve redirect_url / checkout_token
// Devuelve SIEMPRE el detalle del error (tanto de Affirm como de la Function)

const HDRS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const tryParse = (t) => {
  try { return JSON.parse(t); } catch { return null; }
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: HDRS, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: HDRS, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const body = JSON.parse(event.body || "{}");
    const { items, total, currency = "USD", merchant = {}, shipping = {}, billing = {} } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Items are required" }) };
    }
    if (!Number.isInteger(total)) {
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Total must be integer cents" }) };
    }

    const ENV  = String(process.env.AFFIRM_ENV || "prod").toLowerCase();
    const API  = process.env.AFFIRM_API_BASE || (ENV.startsWith("prod") ? "https://api.affirm.com" : "https://sandbox.affirm.com");
    const SITE = process.env.AFFIRM_SITE_BASE_URL || "https://www.sunrisestore.info";

    const PUB  = process.env.AFFIRM_PUBLIC_KEY || "";
    const PRIV = process.env.AFFIRM_PRIVATE_KEY || "";

    // LOGS ÚTILES (van a Netlify → Logs → Functions)
    console.log("[AFFIRM create] env=", ENV, "api=", API,
                "pub_len=", PUB.length, "priv_len=", PRIV.length,
                "site=", SITE);

    if (!PUB || !PRIV) {
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "config_error", detail: "Missing AFFIRM_PUBLIC_KEY / AFFIRM_PRIVATE_KEY" }) };
    }

    const orderId = `SS-${Date.now()}`;

    const checkout = {
      merchant: {
        user_confirmation_url: merchant.user_confirmation_url || `${SITE}/order-success`,
        user_cancel_url:       merchant.user_cancel_url       || `${SITE}/checkout-canceled`,
        user_confirmation_url_action: "GET",
        name: merchant.name || "Sunrise Store",
      },
      shipping: shipping.name || shipping.address ? shipping : undefined,
      billing:  billing.name  || billing.address  ? billing  : undefined,
      items: items.map((it) => ({
        display_name: it.display_name,
        sku: it.sku,
        unit_price: it.unit_price, // CENTAVOS
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
      total, // CENTAVOS
    };

    const AUTH = "Basic " + Buffer.from(`${PUB}:${PRIV}`).toString("base64");

    const res = await fetch(`${API}/api/v2/checkout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: AUTH },
      body: JSON.stringify({ checkout }),
    });

    const txt = await res.text();
    const asJson = tryParse(txt);

    if (!res.ok) {
      console.error("[AFFIRM create] status=", res.status, "body=", txt.slice(0, 800));
      return {
        statusCode: res.status,
        headers: HDRS,
        body: JSON.stringify({
          error: "affirm_error",
          status: res.status,
          affirm: asJson,
          raw: !asJson ? txt.slice(0, 800) : undefined,
        }),
      };
    }

    // OK
    const data = asJson || {};
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
    console.error("[affirm-create-checkout] exception", e);
    return {
      statusCode: 500,
      headers: HDRS,
      body: JSON.stringify({ error: "server_exception", detail: String(e && e.message || e) }),
    };
  }
};
