// netlify/functions/affirm-create-checkout.js
// Crea el checkout v2 en Affirm (PROD). Calcula totales en centavos y arma direcciones válidas US.

const HDRS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const ABS = (url, base) => {
  if (!url) return undefined;
  try {
    // si ya es absoluta, la dejamos; si empieza con "/", la resolvemos contra el site
    return new URL(url, base).toString();
  } catch {
    return undefined;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: HDRS, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: HDRS, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const payload = JSON.parse(event.body || "{}");

    // ITEMS: aceptamos price en dólares o unit_price en centavos. Normalizamos a centavos.
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Items are required" }) };
    }

    const API_BASE = process.env.AFFIRM_API_BASE || "https://api.affirm.com";
    const SITE_BASE = process.env.AFFIRM_SITE_BASE_URL || "https://sunrisestore.info";

    const PUB = process.env.AFFIRM_PUBLIC_KEY;
    const PRIV = process.env.AFFIRM_PRIVATE_KEY;

    if (!PUB || !PRIV) {
      console.error("[AFFIRM] Missing keys");
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    // Normalizamos items -> cents + URLs absolutas
    const normItems = payload.items.map((it) => {
      // price en dólares (number) o unit_price en cents (integer)
      let cents = Number.isInteger(it.unit_price)
        ? it.unit_price
        : Math.round((Number(it.price) || 0) * 100);

      if (!Number.isFinite(cents) || cents <= 0) cents = 0;

      return {
        display_name: it.display_name || it.name || "Item",
        sku: it.sku || it.id || "SKU",
        unit_price: cents,
        qty: Number(it.qty || it.quantity || 1),
        item_image_url: ABS(it.item_image_url || it.image, SITE_BASE),
        item_url: ABS(it.item_url || it.url || (it.slug ? `/product/${it.slug}` : "/"), SITE_BASE),
      };
    });

    // Subtotal / tax / shipping
    const subtotal = normItems.reduce((s, i) => s + i.unit_price * i.qty, 0);
    const shipping_amount = Number.isInteger(payload.shipping_amount) ? payload.shipping_amount : 0;
    const tax_amount = Number.isInteger(payload.tax_amount) ? payload.tax_amount : 0;
    const total = subtotal + shipping_amount + tax_amount;

    // Nombre y dirección US válidos (Affirm procesa solo US)
    const defName = (full = "John Doe") => {
      const [first, ...rest] = String(full).trim().split(/\s+/);
      return { first: first || "John", last: rest.join(" ") || "Doe" };
    };
    const defAddr = (a = {}) => ({
      line1: a.line1 || "123 Main St",
      city: a.city || "Miami",
      state: a.state || "FL",
      zipcode: a.zipcode || "33132",
      country: "US",
    });

    const shipping = {
      name: defName(payload.shipping?.name || payload.buyer?.name),
      address: defAddr(payload.shipping?.address || payload.buyer),
    };
    const billing = {
      name: defName(payload.billing?.name || payload.buyer?.name),
      address: defAddr(payload.billing?.address || payload.buyer),
      email: payload.buyer?.email || payload.billing?.email,
      phone_number: payload.buyer?.phone || payload.billing?.phone,
    };

    const order_id = `SR-${Date.now()}`;

    const checkout = {
      merchant: {
        user_confirmation_url: payload.merchant?.user_confirmation_url || `${SITE_BASE}/order-success`,
        user_cancel_url: payload.merchant?.user_cancel_url || `${SITE_BASE}/checkout-canceled`,
        user_confirmation_url_action: "GET",
        name: payload.merchant?.name || "Sunrise Store",
      },
      items: normItems,
      shipping,
      billing,
      discounts: {},
      metadata: { site: "sunrisestore.info", order_id },
      order_id,
      currency: "USD",
      shipping_amount,
      tax_amount,
      total, // Affirm valida que sea EXACTO (subtotal+shipping+tax)
    };

    // Llamado real
    const res = await fetch(`${API_BASE}/api/v2/checkout`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${PUB}:${PRIV}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checkout }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[AFFIRM checkout] status=", res.status, detail);
      // devolvemos detalle para depurar rápido desde el navegador
      return {
        statusCode: res.status,
        headers: HDRS,
        body: JSON.stringify({ error: "Affirm API error", status: res.status, detail }),
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: HDRS,
      body: JSON.stringify({
        checkout_token: data.checkout_token,
        redirect_url: data.redirect_url,
        order_id,
      }),
    };
  } catch (e) {
    console.error("[affirm-create-checkout] error", e);
    return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
