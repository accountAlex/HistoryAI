import React from 'react';

const ChatSidebar = ({ chats, sidebarVisible, toggleSidebar, handleCreateChat, uuid, navigate, darkMode }) => {
  return (
    <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`} style={{ background: darkMode ? '#0F0F0F' : '#FAFAFA', borderRight: `1px solid ${darkMode ? '#2A2A2A' : '#E0E0E0'}`, boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)' }}>
      <div className="sidebar-header" style={{ padding: '20px', borderBottom: `1px solid ${darkMode ? '#2A2A2A' : '#E0E0E0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: darkMode ? '#E0E0E0' : '#333', margin: 0, letterSpacing: '-0.02em' }}>Чаты</h2>
        <button onClick={handleCreateChat} style={{ background: darkMode ? '#3B82F6' : '#2563EB', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.3s' }}>
          Новый чат
        </button>
      </div>
      <div className="chat-list" style={{ overflowY: 'auto', flex: 1, padding: '10px 0' }}>
        {chats.length === 0 && <div style={{ padding: '15px', color: darkMode ? '#999' : '#666', fontSize: '14px' }}>Нет чатов</div>}
        {chats.map((chat) => (
          <div
            key={chat.uuid}
            className={`chat-item ${chat.uuid === uuid ? 'active' : ''}`}
            onClick={() => navigate(`/chat/${chat.uuid}`)}
            style={{
              padding: '12px 20px',
              color: darkMode ? '#E0E0E0' : '#333',
              background: chat.uuid === uuid ? (darkMode ? '#1A1A1A' : '#F0F0F0') : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '8px',
              margin: '5px 10px',
              transition: 'background 0.3s'
            }}
          >
            <span>{chat.title || `Чат ${new Date(chat.createdAt).toLocaleDateString()}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;