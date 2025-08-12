// Netlify Function: /api/chat (rewritten to /.netlify/functions/chat)
// Minimal dependency approach using native fetch.

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured on server.' }) };
  }
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }
  const { prompt, history } = body;
  if (!prompt || !prompt.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required.' }) };
  }
  const start = Date.now();
  const messages = [];
  if (Array.isArray(history)) {
    history.slice(-15).forEach(m => {
      if (m.role === 'user' || m.role === 'assistant') messages.push({ role: m.role, content: m.content });
    });
  }
  messages.push({ role: 'user', content: prompt });

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    if (!resp.ok) {
      const errJson = await resp.json().catch(() => ({}));
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: errJson.error?.message || 'Upstream error', upstreamStatus: resp.status })
      };
    }
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    return { statusCode: 200, body: JSON.stringify({ reply, tookMs: Date.now() - start }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Server error' }) };
  }
}
