import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';

export default function ChatHistory({ messages, loading }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!messages.length) {
    return <div className="empty-state">Start the conversation by entering a prompt below.</div>;
  }

  return (
    <div className="chat-history" role="log" aria-live="polite">
      {messages.map(m => <ChatMessage key={m.id} message={m} />)}
      {loading && <div className="loading-indicator">AI is thinking…</div>}
      <div ref={endRef} />
    </div>
  );
}
