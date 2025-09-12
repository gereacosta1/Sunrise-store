// netlify/functions/affirm-authorize-capture.js
// Autoriza un cargo con checkout_token y luego CAPTURA (full o amount opcional)

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
    const { checkout_token, order_id, amount_cents, shipping_carrier, shipping_confirmation } =
      JSON.parse(event.body || "{}");

    if (!checkout_token || !order_id) {
      return {
        statusCode: 400,
        headers: HDRS,
        body: JSON.stringify({ error: "Missing checkout_token or order_id" }),
      };
    }

    const API_BASE = process.env.AFFIRM_API_BASE || "https://api.affirm.com";
    const PUB = process.env.AFFIRM_PUBLIC_KEY;
    const PRIV = process.env.AFFIRM_PRIVATE_KEY;
    if (!PUB || !PRIV) {
      console.error("[AFFIRM] Missing keys");
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    const AUTH = "Basic " + Buffer.from(`${PUB}:${PRIV}`).toString("base64");

    console.log('[AFFIRM auth/cap] base=', API_BASE,
            ' pub.len=', (PUB||'').length,
            ' priv.len=', (PRIV||'').length);


    // 1) AUTHORIZE -> charge.id
    const aRes = await fetch(`${API_BASE}/api/v2/charges`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: AUTH },
      body: JSON.stringify({ checkout_token }),
    });

    const aTxt = await aRes.text();
    if (!aRes.ok) {
      console.error("[AFFIRM authorize] status=", aRes.status, aTxt);
      return { statusCode: aRes.status, headers: HDRS, body: JSON.stringify({ error: "Failed to authorize", detail: aTxt }) };
    }
    const charge = JSON.parse(aTxt);
    const charge_id = charge.id;

    // 2) CAPTURE
    const capBody = { order_id };
    if (Number.isInteger(amount_cents)) capBody.amount = amount_cents; // opcional – captura parcial/total
    if (shipping_carrier) capBody.shipping_carrier = shipping_carrier;
    if (shipping_confirmation) capBody.shipping_confirmation = shipping_confirmation;

    const cRes = await fetch(`${API_BASE}/api/v2/charges/${encodeURIComponent(charge_id)}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: AUTH },
      body: JSON.stringify(capBody),
    });

    const cTxt = await cRes.text();
    if (!cRes.ok) {
      console.error("[AFFIRM capture] status=", cRes.status, cTxt);
      return { statusCode: cRes.status, headers: HDRS, body: JSON.stringify({ error: "Failed to capture", detail: cTxt }) };
    }
    const cap = JSON.parse(cTxt);

    return {
      statusCode: 200,
      headers: HDRS,
      body: JSON.stringify({ ok: true, charge_id, amount: cap.amount, currency: cap.currency }),
    };
  } catch (e) {
    console.error("[affirm-authorize-capture] error", e);
    return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
