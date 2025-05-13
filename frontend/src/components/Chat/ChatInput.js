import React from 'react';

const ChatInput = ({ message, setMessage, handleSend, loading, uuid, darkMode }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      handleSend(message);
    }
  };

  return (
    <div className="chat-input" style={{ padding: '15px 30px', background: darkMode ? '#0F0F0F' : '#FAFAFA', borderTop: `1px solid ${darkMode ? '#2A2A2A' : '#E0E0E0'}`, boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.05)' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        placeholder="Введите сообщение..."
        disabled={loading || !uuid}
        style={{ flex: 1, padding: '12px 16px', border: `1px solid ${darkMode ? '#2A2A2A' : '#E0E0E0'}`, borderRadius: '12px', background: darkMode ? '#1A1A1A' : '#FFF', color: darkMode ? '#E0E0E0' : '#333', outline: 'none', fontSize: '15px', boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)', transition: 'border-color 0.3s' }}
      />
      <button onClick={handleSubmit} disabled={loading || !uuid} style={{ background: darkMode ? '#3B82F6' : '#2563EB', color: '#FFF', border: 'none', padding: '12px 16px', borderRadius: '12px', marginLeft: '12px', cursor: loading || !uuid ? 'not-allowed' : 'pointer', opacity: loading || !uuid ? 0.5 : 1, transition: 'background 0.3s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#FFF" style={{ width: '18px', height: '18px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;