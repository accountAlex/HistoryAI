import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import apiClient from '../apiClient';
import '../styles/Card.css';
import CardDropdown from '../components/CardDropdown/CardDropdown';

const PopularPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [popularItems, setPopularItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const mockPopularItems = [
          { id: 1, title: 'Илон Маск', description: 'Основатель Tesla и SpaceX. Самая популярная биография.', date: '2025-05-12', image: 'https://via.placeholder.com/300' },
          { id: 2, title: 'Будущее ИИ в мессенджерах', description: 'Статья о роли ИИ в улучшении общения.', date: '2025-05-08', image: 'https://via.placeholder.com/300' },
          { id: 3, title: 'Запуск ZXChat', description: 'Событие: официальный запуск чат-приложения.', date: '2025-05-01', image: 'https://via.placeholder.com/300' },
        ];
        setPopularItems(mockPopularItems);
      } catch (err) {
        setError(`Не удалось загрузить популярный контент: ${err.message}`);
      }
    };
    fetchPopularItems();
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
      <main className="container mx-auto px-4 py-12">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {popularItems.length === 0 && !error && <p className="text-center text-gray-500">Популярного контента пока нет.</p>}
        {/* <div className="articles-grid">
          {popularItems.map((item) => (
            <div key={item.id} className="article-card">
              <img src={item.image} alt={item.title} className="article-image" />
              <div className="article-content">
                <h3 className="article-title">{item.title}</h3>
                <p className="article-description">{item.description}</p>
                <span className="article-date">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
         */}
        <main className="container" style={{ flex: 1, padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: darkMode ? '#E0E0E0' : '#333', marginBottom: '40px', letterSpacing: '-0.02em' }}>Топ "Что если?"</h1>
          <CardDropdown darkMode={darkMode} />
        </main>
      </main>
      <Footer />
    </div>
  );
};

export default PopularPage;