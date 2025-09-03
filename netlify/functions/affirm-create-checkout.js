// netlify/functions/affirm-create-checkout.js
exports.handler = async (event) => {
  // CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { items, total, currency = 'USD', merchant = {}, shipping = {}, billing = {} } = body;

    // Validaciones mínimas
    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Items are required' }) };
    }
    if (!Number.isInteger(total)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Total must be an integer amount in cents' }) };
    }

    // Entorno y credenciales
    const env = String(process.env.AFFIRM_ENV || 'sandbox').toLowerCase();
    const isProd = env === 'prod' || env === 'production';

    // Usa las que ya cargaste en Netlify; si existieran *_SANDBOX también las toma como fallback
    const publicKey  = process.env.AFFIRM_PUBLIC_KEY  || process.env.AFFIRM_PUBLIC_KEY_SANDBOX;
    const privateKey = process.env.AFFIRM_PRIVATE_KEY || process.env.AFFIRM_PRIVATE_KEY_SANDBOX;

    if (!publicKey || !privateKey) {
      console.error('Missing Affirm credentials');
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    const base = isProd ? 'https://api.affirm.com/api/v2' : 'https://sandbox.affirm.com/api/v2';

    const orderId = `SS-${Date.now()}`;
    const checkoutPayload = {
      merchant: {
        user_confirmation_url: merchant.user_confirmation_url,
        user_cancel_url: merchant.user_cancel_url,
        user_confirmation_url_action: 'GET', // o 'POST' si preferís recibir POST back
        name: merchant.name || 'Sunrise Store',
      },
      shipping: { name: shipping.name, address: shipping.address },
      billing:  { name: billing.name,  address: billing.address },
      items: items.map((it) => ({
        display_name: it.display_name,
        sku: it.sku,
        unit_price: it.unit_price, // en cents
        qty: it.qty,
        item_image_url: it.item_image_url,
        item_url: it.item_url,
      })),
      discounts: {},
      metadata: { platform: 'sunrise-store', order_id: orderId },
      order_id: orderId,
      currency,
      tax_amount: 0,
      shipping_amount: 0,
      total, // en cents (entero)
    };

    const res = await fetch(`${base}/checkout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${publicKey}:${privateKey}`).toString('base64')}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Affirm API error:', res.status, txt);
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({
          error: 'Failed to create checkout',
          details: res.status >= 500 ? 'Service temporarily unavailable' : 'Invalid request',
        }),
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        checkout_token: data.checkout_token,
        redirect_url: data.redirect_url, // útil si querés redirigir en lugar de abrir modal
        order_id: orderId,
      }),
    };
  } catch (err) {
    const message = err && typeof err === 'object' && 'message' in err ? err.message : String(err);
    console.error('Checkout creation error:', message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error', message }) };
  }
};
