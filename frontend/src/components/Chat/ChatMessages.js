import React from 'react';

const ChatMessages = ({ currentMessages, fetchingMessages, error, copyMessage, copiedIndex, messagesEndRef, handleScroll, darkMode }) => {
  return (
    <div className="chat-messages" onScroll={handleScroll} style={{ flex: 1, overflowY: 'auto', padding: '20px 30px', background: darkMode ? '#0F0F0F' : '#FAFAFA' }}>
      {fetchingMessages && (
        <div className="message bot" style={{ background: darkMode ? '#1A1A1A' : '#F0F0F0', color: darkMode ? '#999' : '#666', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', maxWidth: '80%' }}>
          Загрузка сообщений...
        </div>
      )}
      {!fetchingMessages && currentMessages.length === 0 && !error && (
        <div className="message bot" style={{ background: darkMode ? '#1A1A1A' : '#F0F0F0', color: darkMode ? '#999' : '#666', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', maxWidth: '80%' }}>
          История сообщений пуста
        </div>
      )}
      {currentMessages.map((msg, index) => (
        <div key={`${msg.sendAt}-${index}`} className={`message ${msg.type}`} style={{ margin: '12px 0', animation: 'fadeIn 0.3s ease-out', position: 'relative' }}>
          <div className="message-content" style={{ background: msg.type === 'user' ? (darkMode ? '#3B82F6' : '#2563EB') : (darkMode ? '#1A1A1A' : '#F0F0F0'), color: msg.type === 'user' ? '#FFF' : (darkMode ? '#E0E0E0' : '#333'), padding: '12px 16px', borderRadius: '12px', maxWidth: '80%', wordWrap: 'break-word', fontSize: '15px', lineHeight: '1.5', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
            {(() => {
              try {
                return JSON.stringify(JSON.parse(msg.content), null, 2);
              } catch {
                return msg.content;
              }
            })()}
          </div>
          <button
            className="copy-button"
            onClick={() => copyMessage(msg.content, index)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '10px', padding: '5px', opacity: 0, transition: 'opacity 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={darkMode ? '#E0E0E0' : '#666'} style={{ width: '16px', height: '16px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          {copiedIndex === index && (
            <span className="copy-tooltip" style={{ background: darkMode ? '#3B82F6' : '#2563EB', color: '#FFF', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>
              Скопировано!
            </span>
          )}
        </div>
      ))}
      {error && (
        <div className="message bot" style={{ background: darkMode ? '#1A1A1A' : '#F0F0F0', color: darkMode ? '#FF5555' : '#DC2626', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', maxWidth: '80%' }}>
          {error}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;