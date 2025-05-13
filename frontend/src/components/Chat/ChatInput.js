// Импортируем зависимости
import React, { useRef } from 'react';

const ChatInput = ({ message, setMessage, handleSend, loading, uuid, darkMode }) => {
  // Ссылка на поле ввода
  const inputRef = useRef(null);

  // Обработчик отправки
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      handleSend(message);
      setMessage('');
      inputRef.current.focus();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        placeholder="Введите сообщение..."
        disabled={loading || !uuid}
        ref={inputRef}
        aria-label="Поле ввода сообщения"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !uuid}
        aria-label="Отправить сообщение"
      >
        {loading ? (
          <span className="loading-icon">⏳</span>
        ) : (
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatInput;