// netlify/functions/affirm-authorize-capture.js
// Autoriza un cargo (checkout_token -> charge.id) y CAPTURA (full o parcial).
const HDRS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const tryParse = (t) => { try { return JSON.parse(t); } catch { return null; } };

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: HDRS, body: "" };
  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: HDRS, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const { checkout_token, order_id, amount_cents, shipping_carrier, shipping_confirmation } =
      JSON.parse(event.body || "{}");

    if (!checkout_token || !order_id) {
      return { statusCode: 400, headers: HDRS, body: JSON.stringify({ error: "Missing checkout_token or order_id" }) };
    }

    const API_BASE = process.env.AFFIRM_API_BASE || "https://api.affirm.com";
    const PUB = process.env.AFFIRM_PUBLIC_KEY || "";
    const PRIV = process.env.AFFIRM_PRIVATE_KEY || "";

    console.log("[AFFIRM auth/cap] api=", API_BASE, "pub_len=", PUB.length, "priv_len=", PRIV.length);

    if (!PUB || !PRIV) {
      return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "config_error", detail: "Missing keys" }) };
    }

    const AUTH = "Basic " + Buffer.from(`${PUB}:${PRIV}`).toString("base64");

    // 1) AUTHORIZE
    const aRes = await fetch(`${API_BASE}/api/v2/charges`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: AUTH },
      body: JSON.stringify({ checkout_token }),
    });
    const aTxt = await aRes.text();
    const aJson = tryParse(aTxt);

    if (!aRes.ok) {
      console.error("[AFFIRM authorize] status=", aRes.status, "body=", aTxt.slice(0, 800));
      return { statusCode: aRes.status, headers: HDRS, body: JSON.stringify({ error: "authorize_failed", affirm: aJson, raw: !aJson ? aTxt.slice(0,800) : undefined }) };
    }
    const charge = aJson || {};
    const charge_id = charge.id;

    // 2) CAPTURE
    const capBody = { order_id };
    if (Number.isInteger(amount_cents)) capBody.amount = amount_cents;
    if (shipping_carrier) capBody.shipping_carrier = shipping_carrier;
    if (shipping_confirmation) capBody.shipping_confirmation = shipping_confirmation;

    const cRes = await fetch(`${API_BASE}/api/v2/charges/${encodeURIComponent(charge_id)}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: AUTH },
      body: JSON.stringify(capBody),
    });
    const cTxt = await cRes.text();
    const cJson = tryParse(cTxt);

    if (!cRes.ok) {
      console.error("[AFFIRM capture] status=", cRes.status, "body=", cTxt.slice(0, 800));
      return { statusCode: cRes.status, headers: HDRS, body: JSON.stringify({ error: "capture_failed", affirm: cJson, raw: !cJson ? cTxt.slice(0,800) : undefined }) };
    }

    return { statusCode: 200, headers: HDRS, body: JSON.stringify({ ok: true, charge_id, amount: cJson?.amount, currency: cJson?.currency }) };
  } catch (e) {
    console.error("[affirm-authorize-capture] exception", e);
    return { statusCode: 500, headers: HDRS, body: JSON.stringify({ error: "server_exception", detail: String(e && e.message || e) }) };
  }
};
