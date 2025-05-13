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
  darkMode
}) => {
  return (
    <div className="chat-wrapper" style={{ display: 'flex', height: 'calc(100vh - 140px)', width: '100vw' }}>
      <ChatSidebar
        chats={chats}
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        handleCreateChat={handleCreateChat}
        uuid={uuid}
        navigate={navigate}
        darkMode={darkMode}
      />
      <div className="chat-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className="chat-header" style={{ padding: '15px 20px', background: darkMode ? '#0F0F0F' : '#FAFAFA', borderBottom: `1px solid ${darkMode ? '#2A2A2A' : '#E0E0E0'}`, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
          <button className="sidebar-toggle" onClick={toggleSidebar} style={{ marginRight: '15px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="sidebar-toggle-icon" style={{ width: '24px', height: '24px', color: darkMode ? '#E0E0E0' : '#333' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: darkMode ? '#E0E0E0' : '#333', margin: 0, letterSpacing: '-0.02em' }}>Grok Assistant</h1>
        </div>
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