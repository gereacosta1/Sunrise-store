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
    const { charge_token } = JSON.parse(event.body);

    if (!charge_token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing charge_token' })
      };
    }

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

    // Affirm API endpoint for capture
    const affirmApiUrl = isProduction 
      ? `https://api.affirm.com/api/v2/charges/${charge_token}/capture`
      : `https://sandbox.affirm.com/api/v2/charges/${charge_token}/capture`;

    // Capture the charge
    const response = await fetch(affirmApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${publicKey}:${privateKey}`).toString('base64')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Affirm capture error:', response.status, errorData);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to capture charge',
          details: response.status >= 500 ? 'Service temporarily unavailable' : 'Invalid charge token'
        })
      };
    }

    const captureData = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        charge_id: captureData.id,
        amount: captureData.amount,
        currency: captureData.currency
      })
    };

  } catch (error) {
    console.error('Capture error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Unable to process capture request'
      })
    };
  }
};