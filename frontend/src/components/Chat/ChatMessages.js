// Импортируем зависимости
import React from 'react';

const ChatMessages = ({
  currentMessages,
  fetchingMessages,
  error,
  copyMessage,
  copiedIndex,
  messagesEndRef,
  handleScroll,
  darkMode,
}) => {
  return (
    <div className="chat-messages" onScroll={handleScroll}>
      {/* Индикатор загрузки */}
      {fetchingMessages && (
        <div className="message bot">
          <span className="loading-indicator">⏳ Загрузка сообщений...</span>
        </div>
      )}
      {/* Пустая история */}
      {!fetchingMessages && currentMessages.length === 0 && !error && (
        <div className="message bot">
          <span>💬 История сообщений пуста</span>
        </div>
      )}
      {/* Список сообщений */}
      {currentMessages.map((msg, index) => (
        <div
          key={`${msg.sendAt}-${index}`}
          className={`message ${msg.type}`}
        >
          <div className="message-content">
            {(() => {
              try {
                return <pre>{JSON.stringify(JSON.parse(msg.content), null, 2)}</pre>;
              } catch {
                return msg.content;
              }
            })()}
          </div>
          <button
            className="copy-button"
            onClick={() => copyMessage(msg.content, index)}
            aria-label="Скопировать сообщение"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          {copiedIndex === index && (
            <span className="copy-tooltip">✅ Скопировано!</span>
          )}
        </div>
      ))}
      {/* Ошибка */}
      {error && (
        <div className="message bot error">
          <span>❌ {error}</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;