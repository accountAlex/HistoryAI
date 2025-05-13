// Импортируем необходимые зависимости
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ toggleTheme, isDarkTheme }) => {
  // Состояние для мобильного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Элементы навигации
  const navItems = [
    { path: '/chat', label: 'Чат' },
    { path: '/timeline', label: 'Таймлайн' },
    { path: '/articles', label: 'Статьи' },
    { path: '/biographies', label: 'Биографии' },
    { path: '/popular', label: 'Популярное' },
  ];

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
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
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Действия в шапке */}
        <div className="header-actions">
          <button className="btn btn-secondary logout-button" onClick={handleLogout}>
            Выйти
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
              {item.label}
            </Link>
          ))}
          <button className="mobile-nav-link logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;