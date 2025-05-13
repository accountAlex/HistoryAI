// Импортируем зависимости
import React from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import '../../styles/Chat.css';

const ChatContainer = ({
  chats,
  currentMessages,
  sidebarVisible,
  toggleSidebar,
  handleCreateChat,
  handleSend,
  message,
  setMessage,
  loading,
  fetchingMessages,
  error,
  copyMessage,
  copiedIndex,
  messagesEndRef,
  handleScroll,
  uuid,
  navigate,
  darkMode,
}) => {
  // Проверяем статус соединения (заглушка, можно заменить реальной логикой)
  const isConnected = true; // Предполагаем, что соединение активно

  return (
    <div className="chat-wrapper">
      {/* Боковая панель */}
      <ChatSidebar
        chats={chats}
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        handleCreateChat={handleCreateChat}
        uuid={uuid}
        navigate={navigate}
        darkMode={darkMode}
      />
      {/* Основной контейнер чата */}
      <div className="chat-container">
        {/* Заголовок чата */}
        <div className="chat-header">
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarVisible ? 'Скрыть боковую панель' : 'Показать боковую панель'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="sidebar-toggle-icon"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1>Grok Assistant</h1>
          {/* Индикатор статуса */}
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Онлайн' : '🔴 Оффлайн'}
          </span>
        </div>
        {/* Сообщения */}
        <ChatMessages
          currentMessages={currentMessages}
          fetchingMessages={fetchingMessages}
          error={error}
          copyMessage={copyMessage}
          copiedIndex={copiedIndex}
          messagesEndRef={messagesEndRef}
          handleScroll={handleScroll}
          darkMode={darkMode}
        />
        {/* Поле ввода */}
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          loading={loading}
          uuid={uuid}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default ChatContainer;