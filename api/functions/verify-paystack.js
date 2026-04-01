
exports.handler = async (event) => {
  try {
    const reference = event.queryStringParameters?.reference;
    if (!reference) return { statusCode: 400, body: JSON.stringify({ error: 'Missing reference' }) };

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret) return { statusCode: 500, body: JSON.stringify({ error: 'Missing PAYSTACK_SECRET_KEY' }) };
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase env vars' }) };

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { 'Authorization': `Bearer ${secret}` }
    });
    const data = await response.json();

    if (response.ok && data.status) {
      const mappedStatus = data.data.status === 'success' ? 'paid' : data.data.status;
      await fetch(`${supabaseUrl}/rest/v1/orders?reference=eq.${encodeURIComponent(reference)}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: mappedStatus === 'paid' ? 'confirmed' : mappedStatus,
          payment_status: mappedStatus,
          paystack_reference: reference
        })
      });
    }

    return { statusCode: response.status, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
