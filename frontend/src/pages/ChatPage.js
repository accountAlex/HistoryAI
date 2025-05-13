import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import apiClient from '../apiClient';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import '../styles/Chat.css';

const createChat = async () => {
  try {
    const result = await apiClient('http://localhost:8080/api/v1/chats', { method: 'POST' });
    console.log('Создан новый чат:', result);
    return result;
  } catch (error) {
    console.error('Ошибка создания чата:', error);
    return null;
  }
};

const sendMessage = async (message, uuid) => {
  try {
    await apiClient('http://localhost:8080/api/v1/messages', {
      method: 'POST',
      body: JSON.stringify({ uuid, content: message }),
    });
    console.log('Сообщение отправлено:', { uuid, content: message });
    return null;
  } catch (err) {
    console.error('Ошибка отправки сообщения:', err);
    throw new Error('Не удалось отправить сообщение: сервер не отвечает');
  }
};

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messagesByChat, setMessagesByChat] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [chats, setChats] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [error, setError] = useState(null);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { uuid } = useParams();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Загрузка списка чатов
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await apiClient('http://localhost:8080/api/v1/chats?page=0&size=20&sort=createdAt,desc');
        console.log('Список чатов:', data);
        const chatList = data._embedded?.chatModelList || [];
        if (chatList.length === 0) {
          const newChat = await createChat();
          if (newChat?.uuid) {
            setChats([{ ...newChat, createdAt: formatCreatedAt(newChat.createdAt) }]);
            navigate(`/chat/${newChat.uuid}`);
          } else {
            setError('Не удалось создать новый чат');
          }
        } else {
          setChats(chatList.map(chat => ({
            ...chat,
            createdAt: formatCreatedAt(chat.createdAt)
          })));
          if (!uuid || location.pathname === '/chat') {
            navigate(`/chat/${chatList[0].uuid}`);
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки чатов:', err);
        setError('Не удалось загрузить чаты: сервер не отвечает');
      }
    };
    fetchChats();
  }, [navigate, uuid, location.pathname]);

  // Загрузка сообщений для текущего чата
  useEffect(() => {
    if (uuid) {
      const fetchMessages = async (retryCount = 3) => {
        setFetchingMessages(true);
        try {
          const data = await apiClient(`http://localhost:8080/api/v1/messages?uuid=${uuid}&page=${page}&size=20`);
          console.log(`Сообщения для чата ${uuid}, страница ${page}:`, data);
          let messageList = data._embedded?.messageModelList || [];
          if (!Array.isArray(messageList)) {
            messageList = [];
          }
          setMessagesByChat((prev) => {
            let existingMessages = page === 0 ? [] : (prev[uuid] || []);
            const newMessages = messageList
              .filter((msg) => !existingMessages.some((existing) => existing.sendAt.join() === msg.sendAt.join()))
              .map((msg) => ({
                type: msg.user === true ? 'user' : 'bot',
                content: msg.content || 'Пустое сообщение',
                sendAt: msg.sendAt
              }));
            return {
              ...prev,
              [uuid]: [...existingMessages, ...newMessages].sort(
                (a, b) => new Date(a.sendAt.join('-')) - new Date(b.sendAt.join('-'))
              )
            };
          });
          setHasMore(data.page?.number < data.page?.totalPages - 1);
        } catch (err) {
          if (retryCount > 0) {
            console.warn(`Повторная попытка загрузки сообщений (${retryCount} осталось)`);
            setTimeout(() => fetchMessages(retryCount - 1), 1000);
          } else {
            console.error(`Ошибка загрузки сообщений для чата ${uuid}:`, err);
            setError('Не удалось загрузить сообщения: сервер не отвечает');
            setHasMore(false);
          }
        } finally {
          setFetchingMessages(false);
        }
      };
      fetchMessages();
      return () => {
        setPage(0);
        setHasMore(true);
        setFetchingMessages(false);
        setMessagesByChat((prev) => ({ ...prev, [uuid]: [] }));
      };
    }
  }, [uuid, page]);

  // Подключение WebSocket
  useEffect(() => {
    if (uuid) {
      const token = Cookies.get('jwtToken');
      if (!token) {
        console.error('JWT-токен отсутствует');
        setError('Ошибка аутентификации: пожалуйста, войдите снова');
        navigate('/login');
        return;
      }
      const socket = new SockJS('http://localhost:8080/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => {
          console.log(`WebSocket подключён для чата ${uuid}`);
          client.subscribe(`/topic/chat/${uuid}/llmResponses`, (msg) => {
            let body;
            try {
              if (msg.binaryBody) {
                const decoder = new TextDecoder('utf-8');
                body = decoder.decode(msg.binaryBody);
              } else {
                body = msg.body;
              }
              console.log('Получено сообщение бота:', body);
              setMessagesByChat((prev) => {
                const currentMessages = prev[uuid] || [];
                // Check if message already exists
                const messageExists = currentMessages.some(
                  existingMsg => existingMsg.content === body && existingMsg.type === 'bot'
                );
                if (messageExists) {
                  return prev;
                }
                return {
                  ...prev,
                  [uuid]: [
                    ...currentMessages,
                    { type: 'bot', content: body, sendAt: new Date().toISOString() }
                  ].sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))
                };
              });
              setLoading(false);
            } catch (err) {
              console.error('Ошибка обработки WebSocket-сообщения:', err);
              setError('Ошибка получения ответа от бота');
              setMessagesByChat((prev) => ({
                ...prev,
                [uuid]: [
                  ...(prev[uuid] || []),
                  { type: 'bot', content: 'Ошибка обработки ответа сервера', sendAt: new Date().toISOString() }
                ].sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))
              }));
            }
          });
        },
        onStompError: (frame) => {
          console.error('Ошибка WebSocket:', frame);
          setError('Ошибка подключения к WebSocket: сервер не отвечает');
        },
      });

      client.activate();
      stompClient.current = client;

      return () => client.deactivate();
    }
  }, [uuid, navigate]);

  // Загрузка дополнительных сообщений при прокрутке вверх
  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop === 0 && hasMore && !fetchingMessages) {
      setPage((prev) => prev + 1);
    }
  };

  // Отправка сообщения
  const handleSend = async () => {
    if (!message.trim() || !uuid) return;
    setMessagesByChat((prev) => ({
      ...prev,
      [uuid]: [
        ...(prev[uuid] || []),
        { type: 'user', content: message, sendAt: new Date().toISOString() }
      ].sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))
    }));
    setMessage('');
    setLoading(true);
    setError(null);
    try {
      await sendMessage(message, uuid);
    } catch (err) {
      setMessagesByChat((prev) => ({
        ...prev,
        [uuid]: [
          ...(prev[uuid] || []),
          { type: 'bot', content: err.message, sendAt: new Date().toISOString() }
        ].sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))
      }));
      setLoading(false);
      setError(err.message);
    }
  };

  // Переключение темы
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark');
  };

  // Копирование сообщения
  const copyMessage = (content, index) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch((err) => {
      console.error('Ошибка копирования сообщения:', err);
      setError('Не удалось скопировать сообщение');
    });
  };

  // Создание нового чата
  const handleCreateChat = async () => {
    const newChat = await createChat();
    if (newChat?.uuid) {
      setChats((prev) => [{ ...newChat, createdAt: formatCreatedAt(newChat.createdAt) }, ...prev]);
      navigate(`/chat/${newChat.uuid}`);
    } else {
      setError('Не удалось создать чат');
    }
  };

  // Переключение видимости боковой панели
  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  // Форматирование времени создания чата
  const formatCreatedAt = (createdAt) => {
    if (Array.isArray(createdAt)) {
      const [year, month, day, hour, minute] = createdAt;
      return new Date(year, month - 1, day, hour, minute).toISOString();
    }
    return createdAt;
  };

  const currentMessages = messagesByChat[uuid] || [];

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
      <main className="chat-page-container">
        <div className={`chat-sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
          <div className="sidebar-header">
            <h2>Conversations</h2>
            <button className="new-chat-button" onClick={handleCreateChat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Chat
            </button>
          </div>
          <div className="chat-list">
            {error && <div className="chat-item error">{error}</div>}
            {chats.length === 0 && !error && (
              <div className="chat-item">No conversations yet</div>
            )}
            {chats.map((chat) => (
              <Link
                key={chat.uuid}
                to={`/chat/${chat.uuid}`}
                className={`chat-item ${chat.uuid === uuid ? 'active' : ''}`}
              >
                {new Date(chat.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Link>
            ))}
          </div>
        </div>
        <div className="chat-main">
          <div className="chat-header">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2>Chat</h2>
          </div>
          <div className="chat-messages" onScroll={handleScroll}>
            {fetchingMessages && (
              <div className="message bot">
                <div className="message-content">Loading messages...</div>
              </div>
            )}
            {!fetchingMessages && currentMessages.length === 0 && !error && (
              <div className="message bot">
                <div className="message-content">No messages yet</div>
              </div>
            )}
            {currentMessages.map((msg, index) => (
              <div key={`${msg.sendAt}-${index}`} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.type === 'bot' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
                <button
                  className="copy-button"
                  onClick={() => copyMessage(msg.content, index)}
                  title="Copy message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
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
                  <span className="copy-tooltip">Copied!</span>
                )}
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            {error && (
              <div className="message bot error">
                <div className="message-content">{error}</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              className="chat-input-field"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading || !uuid}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={loading || !uuid}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;