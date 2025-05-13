import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleTheme, isDarkTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/chat', label: 'Чат' },
    { path: '/timeline', label: 'Таймлайн' },
    { path: '/articles', label: 'Статьи' },
    { path: '/biographies', label: 'Биографии' },
    { path: '/popular', label: 'Популярное' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          AI History
        </Link>

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

        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-secondary logout-button" onClick={handleLogout}>
            Выйти
          </button>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <span className="menu-icon"></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <h2>Меню</h2>
          <button className="mobile-menu-close" onClick={toggleMobileMenu}>
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