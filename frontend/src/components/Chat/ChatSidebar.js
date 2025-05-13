// Импортируем зависимости
import React, { useState } from 'react';

const ChatSidebar = ({ chats, sidebarVisible, toggleSidebar, handleCreateChat, uuid, navigate, darkMode }) => {
  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация чатов по поисковому запросу
  const filteredChats = chats.filter((chat) =>
    (chat.title || `Чат ${new Date(chat.createdAt).toLocaleDateString()}`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`chat-sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
      {/* Заголовок боковой панели */}
      <div className="sidebar-header">
        <h2>Чаты</h2>
        <button className="new-chat-button" onClick={handleCreateChat}>
          + Новый чат
        </button>
      </div>
      {/* Поле поиска */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Поиск чатов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      {/* Список чатов */}
      <div className="chat-list">
        {filteredChats.length === 0 ? (
          <div className="no-chats">Чаты не найдены</div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.uuid}
              className={`chat-item ${chat.uuid === uuid ? 'active' : ''}`}
              onClick={() => navigate(`/chat/${chat.uuid}`)}
            >
              <span>{chat.title || `Чат ${new Date(chat.createdAt).toLocaleDateString()}`}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;