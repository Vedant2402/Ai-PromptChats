import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic key sanity check
const apiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim();
if (!apiKey) {
  console.warn('[WARN] OPENAI_API_KEY missing in environment. Add it to .env');
}

let openai = null;
try {
  if (apiKey) {
    openai = new OpenAI({ apiKey });
  }
} catch (e) {
  console.error('[INIT] Failed to initialize OpenAI client:', e.message);
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Diagnostics endpoint (no secret exposure)
app.get('/api/diag', (_req, res) => {
  res.json({
    hasKey: Boolean(apiKey),
    keyLength: apiKey ? apiKey.length : 0,
    nodeVersion: process.version,
    modelDefault: 'gpt-4o-mini'
  });
});

app.post('/api/chat', async (req, res) => {
  const start = Date.now();
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'Server missing OPENAI_API_KEY. Create .env and restart server.' });
    }
    if (!openai) {
      return res.status(500).json({ error: 'OpenAI client not initialized.' });
    }
    const { prompt, history } = req.body || {};
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const messages = [];
    if (Array.isArray(history)) {
      history.slice(-15).forEach(m => {
        if (m.role === 'user' || m.role === 'assistant') {
          messages.push({ role: m.role, content: m.content });
        }
      });
    }
    messages.push({ role: 'user', content: prompt });

    let answer = '';
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500
      });
      answer = completion.choices?.[0]?.message?.content?.trim() || '';
    } catch (apiErr) {
      console.error('[OpenAI API Error]', apiErr.status, apiErr.message);
      return res.status(apiErr.status || 502).json({
        error: apiErr.message || 'Upstream model error',
        upstreamStatus: apiErr.status || null
      });
    }

    res.json({ reply: answer, tookMs: Date.now() - start });
  } catch (err) {
    console.error('Unhandled chat route error', err);
    res.status(500).json({ error: 'Internal server error (chat route)' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
