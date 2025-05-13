import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../apiClient';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import '../styles/Biographies.css';

const BiographiesPage = () => {
  const [biographies, setBiographies] = useState([]);
  const [selectedBiography, setSelectedBiography] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Загрузка списка биографий
  useEffect(() => {
    const fetchBiographies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient('http://localhost:8080/api/v1/biographies?limit=20');
        console.log('BiographiesPage: Список биографий:', data);
        setBiographies(data || []);
      } catch (err) {
        console.error('BiographiesPage: Ошибка загрузки биографий:', err);
        const errorMessage = err.message.includes('HTML')
          ? 'Не удалось загрузить биографии: сервер перенаправил на страницу логина. Пожалуйста, войдите снова.'
          : `Не удалось загрузить биографии: ${err.message}`;
        setError(errorMessage);
        if (err.message.includes('401') || err.message.includes('403')) {
          console.warn('BiographiesPage: Неавторизован, редирект на /auth');
          navigate('/auth');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBiographies();
  }, [navigate]);

  // Загрузка полной биографии при изменении URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get('url');
    if (url) {
      const fetchBiography = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await apiClient(`http://localhost:8080/api/v1/biographies/get?url=${encodeURIComponent(url)}`);
          console.log('BiographiesPage: Полная биография:', data);
          setSelectedBiography(data);
        } catch (err) {
          console.error('BiographiesPage: Ошибка загрузки биографии:', err);
          const errorMessage = err.message.includes('HTML')
            ? 'Не удалось загрузить биографию: сервер перенаправил на страницу логина. Пожалуйста, войдите снова.'
            : `Не удалось загрузить биографию: ${err.message}`;
          setError(errorMessage);
          if (err.message.includes('401') || err.message.includes('403')) {
            console.warn('BiographiesPage: Неавторизован, редирект на /auth');
            navigate('/auth');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchBiography();
    } else {
      setSelectedBiography(null);
    }
  }, [location.search, navigate]);

  // Переключение темы
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
      <main className="biographies-page-container">
        <div className="biographies-main">
          <h2 className="text-2xl font-semibold mb-6">Биографии</h2>
          {error && (
            <div className="error-message">{error}</div>
          )}
          {loading && (
            <div className="loading-message">Загрузка...</div>
          )}
          {!loading && !error && !selectedBiography && (
            <div className="biographies-list">
              {biographies.length === 0 && (
                <div className="no-biographies">Биографий нет</div>
              )}
              {biographies.map((biography, index) => (
                <Link
                  key={index}
                  to={`/biographies?url=${encodeURIComponent(biography.url)}`}
                  className="biography-card"
                >
                  <img
                    src={biography.imageUrl}
                    alt={biography.title}
                    className="biography-image"
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                  />
                  <h3 className="biography-title">{biography.title}</h3>
                </Link>
              ))}
            </div>
          )}
          {!loading && !error && selectedBiography && (
            <div className="biography-content">
              <h1 className="biography-content-title">{selectedBiography.title}</h1>
              <img
                src={selectedBiography.titlePhoto}
                alt={selectedBiography.title}
                className="biography-content-image"
                onError={(e) => (e.target.src = '/placeholder.jpg')}
              />
              <div className="biography-sections">
                {selectedBiography.sections?.map((section, index) => (
                  <div key={index} className="biography-section">
                    <h2 className="biography-section-heading">{section.heading}</h2>
                    <div
                      className="biography-section-content"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                ))}
              </div>
              <button
                className="back-button"
                onClick={() => navigate('/biographies')}
              >
                Назад к списку
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BiographiesPage;