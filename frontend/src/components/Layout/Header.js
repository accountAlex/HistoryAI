// Импортируем необходимые зависимости
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleTheme, isDarkTheme }) => {
  // Состояние для мобильного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Элементы навигации
  const navItems = [
    { path: '/chat', label: 'Чат', icon: '💬' },
    { path: '/timeline', label: 'Таймлайн', icon: '⏳' },
    { path: '/articles', label: 'Статьи', icon: '📝' },
    { path: '/biographies', label: 'Биографии', icon: '👤' },
    { path: '/popular', label: 'Популярное', icon: '🔥' },
  ];

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  // Переключение мобильного меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Логотип с переходом на главную */}
        <Link to="/" className="header-logo">
          AI History
        </Link>

        {/* Навигация для десктопа */}
        <nav className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Действия в шапке */}
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkTheme ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
          >
            {isDarkTheme ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-secondary logout-button" onClick={handleLogout}>
            Выйти
          </button>
          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span className="menu-icon"></span>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <h2>Меню</h2>
          <button
            className="mobile-menu-close"
            onClick={toggleMobileMenu}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
        </div>
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={toggleMobileMenu}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button className="mobile-nav-link logout-button" onClick={handleLogout}>
            🚪 Выйти
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;