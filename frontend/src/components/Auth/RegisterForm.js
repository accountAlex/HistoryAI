// Импортируем зависимости
import React, { useState } from 'react';

const RegisterForm = ({ onSubmit, message, setMessage, goToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">Регистрация</h2>
        {/* Поле email */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="Введите ваш email"
            aria-label="Email"
          />
        </div>
        {/* Поле пароля */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Пароль:
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Введите пароль"
              aria-label="Пароль"
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
        {/* Кнопка регистрации */}
        <button type="submit" className="form-button">
          Зарегистрироваться
        </button>
        {/* Сообщение об ошибке */}
        {message && (
          <p className={`form-message ${message.includes('Ошибка') ? 'error' : ''}`}>
            {message}
          </p>
        )}
        {/* Переход к входу */}
        <button type="button" className="form-nav-button" onClick={goToLogin}>
          Уже есть аккаунт? Войти
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;