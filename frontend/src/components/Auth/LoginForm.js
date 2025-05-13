// Импортируем зависимости
import React, { useState } from 'react';
import '../../styles/Form.css';

// Компонент формы авторизации
const LoginForm = ({ onSubmit, message, setMessage, goToRegister }) => {
  // Состояния для полей формы и видимости пароля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    onSubmit({ email, password });
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form">
        {/* Заголовок формы */}
        <h2 className="form-title">Авторизация</h2>
        
        {/* Поле email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <div className="input-wrapper">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Введите ваш email"
              aria-label="Поле для ввода email"
            />
          </div>
        </div>

        {/* Поле пароля */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Пароль
          </label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Введите пароль"
              aria-label="Поле для ввода пароля"
            />
            <button
              type="button"
              className="show-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Кнопка входа */}
        <button type="submit" className="form-button">
          Войти
        </button>

        {/* Сообщение об ошибке или успехе */}
        {message && (
          <p className={`form-message ${message.toLowerCase().includes('ошибка') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}

        {/* Переход к регистрации */}
        <button
          type="button"
          className="form-nav-button"
          onClick={goToRegister}
          aria-label="Перейти к регистрации"
        >
          Нет аккаунта? Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default LoginForm;