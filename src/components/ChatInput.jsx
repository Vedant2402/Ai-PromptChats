import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <form className="chat-input" onSubmit={submit}>
      <textarea
        className="prompt-box"
        placeholder="Type your prompt..."
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={2}
        disabled={disabled}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            submit(e);
          }
        }}
      />
      <button type="submit" className="btn primary" disabled={disabled || !value.trim()}>
        {disabled ? 'Thinking...' : 'Send'}
      </button>
    </form>
  );
}
