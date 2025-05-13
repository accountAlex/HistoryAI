import React from 'react';

const RegisterForm = ({ onSubmit, message, setMessage, goToLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="form-title">Регистрация</h2>
      <div className="form-group">
        <label className="form-label">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
          placeholder="Введите ваш email"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Пароль:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
          placeholder="Введите пароль"
        />
      </div>
      <button type="submit" className="form-button">Зарегистрироваться</button>
      {message && <p className="form-message">{message}</p>}
      <button type="button" className="form-nav-button" onClick={goToLogin}>
        Уже есть аккаунт? Войти
      </button>
    </form>
  );
};

export default RegisterForm;