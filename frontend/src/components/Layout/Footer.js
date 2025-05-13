import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Навигация',
      links: [
        { label: 'Чат', path: '/chat' },
        { label: 'Таймлайн', path: '/timeline' },
        { label: 'Статьи', path: '/articles' },
        { label: 'Биографии', path: '/biographies' },
        { label: 'Популярное', path: '/popular' },
      ],
    },
    {
      title: 'О проекте',
      links: [
        { label: 'О нас', path: '/about' },
        { label: 'Контакты', path: '/contacts' },
        { label: 'Политика конфиденциальности', path: '/privacy' },
        { label: 'Условия использования', path: '/terms' },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        {footerSections.map((section, index) => (
          <div key={index} className="footer-section">
            <h3>{section.title}</h3>
            <ul className="footer-links">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="footer-section">
          <h3>AI History</h3>
          <p className="footer-description">
            Современный портал об истории, объединяющий искусственный интеллект и исторические знания.
          </p>
          <p className="footer-copyright">
            © {currentYear} AI History. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;