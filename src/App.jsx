import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatInput from './components/ChatInput.jsx';
import ChatHistory from './components/ChatHistory.jsx';

const STORAGE_KEY = 'chat_history_v1';

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendPrompt = useCallback(async (prompt) => {
    if (!prompt.trim()) return;
    setError(null);
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: prompt, ts: Date.now() };
    const pendingMsg = { id: crypto.randomUUID(), role: 'assistant', content: '', ts: Date.now(), pending: true };
    setMessages(prev => [...prev, userMsg, pendingMsg]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    async function callEndpoint(url) {
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history: messages }),
        signal: controller.signal
      });
    }

    try {
      let res = await callEndpoint('/api/chat');
      if (res.status === 404) {
        // Fallback for static deploys without redirect working
        console.warn('[chat] /api/chat 404 – attempting direct Netlify function path');
        res = await callEndpoint('/.netlify/functions/chat');
      }
      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch { /* ignore */ }
        const detail = [data.error, data.upstreamStatus ? `(upstream ${data.upstreamStatus})` : null, res.status === 404 ? '(/api/chat not found; ensure netlify.toml deployed from repo root)' : null]
          .filter(Boolean).join(' ');
        throw new Error(detail || `Error ${res.status}`);
      }
      const data = await res.json();
      setMessages(prev => prev.map(m => m.id === pendingMsg.id ? { ...m, content: data.reply, pending: false } : m));
    } catch (e) {
      if (e.name === 'AbortError') {
        setError('Request canceled');
      } else {
        console.error('Chat request failed:', e);
        setError(e.message || 'Unknown error');
        setMessages(prev => prev.filter(m => m.id !== pendingMsg.id));
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [messages]);

  const handleClear = () => {
    if (!confirm('Clear chat history?')) return;
    setMessages([]);
    setError(null);
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Vedant's AI Prompt Chat</h1>
        <div className="header-actions">
          {loading && <button onClick={handleStop} className="btn secondary">Stop</button>}
          <button onClick={handleClear} className="btn danger outline">Clear</button>
        </div>
      </header>
      <main className="chat-area">
        <ChatHistory messages={messages} loading={loading} />
      </main>
      <footer className="input-area">
        {error && <div className="error-banner">{error}</div>}
        <ChatInput onSend={sendPrompt} disabled={loading} />
        <div className="footer-note">Model: gpt-4o-mini | History stored locally | By Vedant Kankate</div>
      </footer>
    </div>
  );
}
