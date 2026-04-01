exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const body = JSON.parse(event.body || '{}');
    const { reference, id, status, rider_id, payment_status } = body;
    if (!reference && !id) return { statusCode: 400, body: JSON.stringify({ error: 'Reference or id is required' }) };

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase environment variables' }) };

    const patch = {};
    if (status) patch.status = status;
    if (typeof rider_id !== 'undefined') patch.rider_id = rider_id || null;
    if (payment_status) patch.payment_status = payment_status;
    patch.updated_at = new Date().toISOString();

    const query = reference ? `reference=eq.${encodeURIComponent(reference)}` : `id=eq.${encodeURIComponent(id)}`;
    const res = await fetch(`${supabaseUrl}/rest/v1/orders?${query}`, {
      method: 'PATCH',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patch)
    });

    if (!res.ok) {
      const txt = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: txt || 'Update failed' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, ...patch }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Server error' }) };
  }
};
