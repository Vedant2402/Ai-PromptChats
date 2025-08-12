import React from 'react';

export default function ChatMessage({ message }) {
  const { role, content, pending } = message;
  return (
    <div className={`chat-msg ${role}`}> 
      <div className="avatar" aria-hidden>
        {role === 'user' ? '🧑' : '🤖'}
      </div>
      <div className="bubble">
        {pending ? <span className="pending">…</span> : content}
      </div>
    </div>
  );
}
