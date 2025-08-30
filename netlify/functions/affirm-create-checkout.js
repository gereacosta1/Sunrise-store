exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { items, total, currency, merchant, shipping, billing } = JSON.parse(event.body);

    // Validate required environment variables
    const isProduction = process.env.AFFIRM_ENV === 'prod';
    const publicKey = isProduction ? process.env.AFFIRM_PUBLIC_KEY : process.env.AFFIRM_PUBLIC_KEY_SANDBOX;
    const privateKey = isProduction ? process.env.AFFIRM_PRIVATE_KEY : process.env.AFFIRM_PRIVATE_KEY_SANDBOX;

    if (!publicKey || !privateKey) {
      console.error('Missing Affirm credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Affirm API endpoint
    const affirmApiUrl = isProduction 
      ? 'https://api.affirm.com/api/v2/checkout'
      : 'https://sandbox.affirm.com/api/v2/checkout';

    // Prepare checkout payload
    const checkoutPayload = {
      merchant: {
        user_confirmation_url: merchant.user_confirmation_url,
        user_cancel_url: merchant.user_cancel_url,
        user_confirmation_url_action: 'GET',
        name: merchant.name || 'Sunrise Store'
      },
      shipping: {
        name: shipping.name,
        address: shipping.address
      },
      billing: {
        name: billing.name,
        address: billing.address
      },
      items: items.map(item => ({
        display_name: item.display_name,
        sku: item.sku,
        unit_price: item.unit_price,
        qty: item.qty,
        item_image_url: item.item_image_url,
        item_url: item.item_url
      })),
      discounts: {},
      metadata: {
        platform: 'sunrise-store',
        order_id: `SS-${Date.now()}`
      },
      order_id: `SS-${Date.now()}`,
      currency: currency || 'USD',
      tax_amount: 0,
      shipping_amount: 0,
      total: total
    };

    // Create checkout with Affirm
    const response = await fetch(affirmApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${publicKey}:${privateKey}`).toString('base64')}`
      },
      body: JSON.stringify(checkoutPayload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Affirm API error:', response.status, errorData);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to create checkout',
          details: response.status >= 500 ? 'Service temporarily unavailable' : 'Invalid request'
        })
      };
    }

    const checkoutData = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        checkout_token: checkoutData.checkout_token,
        order_id: checkoutPayload.order_id
      })
    };

  } catch (error) {
    console.error('Checkout creation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Unable to process checkout request'
      })
    };
  }
};