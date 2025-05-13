import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import apiClient from '../apiClient';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import '../styles/Chat.css';

const ChatPage = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Загрузка сообщений
  useEffect(() => {
    if (uuid) {
      const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await apiClient(`http://localhost:8080/api/v1/messages?chatId=${uuid}`);
          console.log('ChatPage: Список сообщений:', data);
          setMessages(data || []);
        } catch (err) {
          console.error('ChatPage: Ошибка загрузки сообщений:', err);
          const errorMessage = err.message.includes('HTML')
            ? 'Не удалось загрузить сообщения: сервер перенаправил на страницу логина. Пожалуйста, войдите снова.'
            : `Не удалось загрузить сообщения: ${err.message}`;
          setError(errorMessage);
          if (err.message.includes('401') || err.message.includes('403')) {
            console.warn('ChatPage: Неавторизован, редирект на /auth');
            navigate('/auth');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }
  }, [uuid, navigate]);

  // Настройка WebSocket
  useEffect(() => {
    if (uuid) {
      const token = Cookies.get('jwtToken');
      if (!token) {
        console.warn('ChatPage: Токен отсутствует, редирект на /auth');
        navigate('/auth');
        return;
      }

      socketRef.current = new WebSocket(`ws://localhost:8080/ws?chatId=${uuid}&token=${token}`);

      socketRef.current.onopen = () => {
        console.log('ChatPage: WebSocket подключён');
      };

      socketRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('ChatPage: Новое сообщение:', message);
          setMessages((prev) => [...prev, message]);
        } catch (err) {
          console.error('ChatPage: Ошибка парсинга сообщения WebSocket:', err);
          setError('Ошибка получения сообщения');
        }
      };

      socketRef.current.onerror = (err) => {
        console.error('ChatPage: Ошибка WebSocket:', err);
        setError('Ошибка соединения с чатом');
      };

      socketRef.current.onclose = () => {
        console.log('ChatPage: WebSocket закрыт');
      };

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [uuid, navigate]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка сообщения
  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        chatId: uuid,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.send(JSON.stringify(message));
      setMessages((prev) => [...prev, { ...message, sender: 'user' }]);
      setNewMessage('');
    }
  };

  // Переключение темы
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
      <main className="chat-page-container">
        <div className="chat-main">
          <div className="chat-list">
            <Link to="/articles" className="chat-item">Статьи</Link>
            <Link to="/biographies" className="chat-item">Биографии</Link>
            <Link to="/popular" className="chat-item">Популярное</Link>
            <Link to="/chat/1" className="chat-item">Чат 1</Link>
            <Link to="/chat/2" className="chat-item">Чат 2</Link>
          </div>
          <div className="chat-content">
            <h2 className="text-2xl font-semibold mb-6">Чат {uuid}</h2>
            {error && (
              <div className="error-message">{error}</div>
            )}
            {loading && (
              <div className="loading-message">Загрузка...</div>
            )}
            {!loading && !error && (
              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    <span>{msg.content}</span>
                    <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Отправить</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;