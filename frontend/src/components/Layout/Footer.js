// Импортируем зависимости
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  // Текущий год для копирайта
  const currentYear = new Date().getFullYear();

  // Секции футера
  const footerSections = [
    {
      title: 'Навигация',
      links: [
        { label: 'Чат', path: '/chat', icon: '💬' },
        { label: 'Таймлайн', path: '/timeline', icon: '⏳' },
        { label: 'Статьи', path: '/articles', icon: '📝' },
        { label: 'Биографии', path: '/biographies', icon: '👤' },
        { label: 'Популярное', path: '/popular', icon: '🔥' },
      ],
    },
    {
      title: 'О проекте',
      links: [
        { label: 'О нас', path: '/about', icon: 'ℹ️' },
        { label: 'Контакты', path: '/contacts', icon: '📧' },
        { label: 'Политика конфиденциальности', path: '/privacy', icon: '🔒' },
        { label: 'Условия использования', path: '/terms', icon: '📜' },
      ],
    },
  ];

  // Социальные сети
  const socialLinks = [
    { label: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    { label: 'GitHub', url: 'https://github.com', icon: '💻' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Секции навигации и информации */}
        {footerSections.map((section, index) => (
          <div key={index} className="footer-section">
            <h3>{section.title}</h3>
            <ul className="footer-links">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link to={link.path} className="footer-link">
                    <span className="footer-link-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Секция с описанием и соцсетями */}
        <div className="footer-section">
          <h3>AI History</h3>
          <p className="footer-description">
            Современный портал об истории, объединяющий искусственный интеллект и исторические знания.
          </p>
          <ul className="footer-links social-links">
            {socialLinks.map((social, index) => (
              <li key={index}>
                <a href={social.url} className="footer-link" target="_blank" rel="noopener noreferrer">
                  <span className="footer-link-icon">{social.icon}</span>
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="footer-copyright">
            © {currentYear} AI History. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;