import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import apiClient from '../apiClient';
import '../styles/Form.css';

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState('login');
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const params = new URLSearchParams();
    params.append('email', credentials.email);
    params.append('password', credentials.password);
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (response.ok) {
        const token = response.headers.get('Authorization')?.replace('Bearer ', '');
        if (token) {
          Cookies.set('jwtToken', token, { expires: 1 });
          navigate('/chat');
        } else {
          setMessage('Ошибка: Токен отсутствует в ответе сервера.');
        }
      } else {
        const errorText = await response.text();
        setMessage(`Ошибка: ${errorText}`);
      }
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  const handleRegister = async (userData) => {
    try {
      await apiClient('http://localhost:8080/api/registration', {
        method: 'POST',
        body: JSON.stringify({ email: userData.email, password: userData.password }),
      });
      setMessage('Регистрация успешна! Пожалуйста, войдите.');
      setActiveForm('login');
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  const [message, setMessage] = useState('');

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="form-card">
          {activeForm === 'login' ? (
            <LoginForm onSubmit={handleLogin} message={message} setMessage={setMessage} goToRegister={() => setActiveForm('register')} />
          ) : (
            <RegisterForm onSubmit={handleRegister} message={message} setMessage={setMessage} goToLogin={() => setActiveForm('login')} />
          )}
        </div>
      </div>
      <div className="auth-brand-side">
        <div className="brand-content">
          <h1 className="brand-title">ZXChat</h1>
          <p className="brand-subtitle">{activeForm === 'login' ? 'Войдите, чтобы начать общение!' : 'Присоединяйтесь к нашему сообществу!'}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;