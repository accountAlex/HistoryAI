import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../apiClient';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import '../styles/Articles.css';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Загрузка списка статей
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient('http://localhost:8080/api/v1/articles?limit=20');
        console.log('ArticlesPage: Список статей:', data);
        setArticles(data || []);
      } catch (err) {
        console.error('ArticlesPage: Ошибка загрузки статей:', err);
        const errorMessage = err.message.includes('HTML')
          ? 'Не удалось загрузить статьи: сервер перенаправил на страницу логина. Пожалуйста, войдите снова.'
          : `Не удалось загрузить статьи: ${err.message}`;
        setError(errorMessage);
        if (err.message.includes('401') || err.message.includes('403')) {
          console.warn('ArticlesPage: Неавторизован, редирект на /auth');
          navigate('/auth');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [navigate]);

  // Загрузка полной статьи при изменении URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get('url');
    const img = params.get('img');
    if (url && img) {
      const fetchArticle = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await apiClient(`http://localhost:8080/api/v1/articles/get?url=${encodeURIComponent(url)}&img=${encodeURIComponent(img)}`);
          console.log('ArticlesPage: Полная статья:', data);
          setSelectedArticle(data);
        } catch (err) {
          console.error('ArticlesPage: Ошибка загрузки статьи:', err);
          const errorMessage = err.message.includes('HTML')
            ? 'Не удалось загрузить статью: сервер перенаправил на страницу логина. Пожалуйста, войдите снова.'
            : `Не удалось загрузить статью: ${err.message}`;
          setError(errorMessage);
          if (err.message.includes('401') || err.message.includes('403')) {
            console.warn('ArticlesPage: Неавторизован, редирект на /auth');
            navigate('/auth');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    } else {
      setSelectedArticle(null);
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
      <main className="articles-page-container">
        <div className="articles-main">
          <h2 className="text-2xl font-semibold mb-6">Статьи</h2>
          {error && (
            <div className="error-message">{error}</div>
          )}
          {loading && (
            <div className="loading-message">Загрузка...</div>
          )}
          {!loading && !error && !selectedArticle && (
            <div className="articles-list">
              {articles.length === 0 && (
                <div className="no-articles">Статей нет</div>
              )}
              {articles.map((article, index) => (
                <Link
                  key={index}
                  to={`/articles?url=${encodeURIComponent(article.url)}&img=${encodeURIComponent(article.imageUrl)}`}
                  className="article-card"
                >
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="article-image"
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                  />
                  <h3 className="article-title">{article.title}</h3>
                </Link>
              ))}
            </div>
          )}
          {!loading && !error && selectedArticle && (
            <div className="article-content">
              <h1 className="article-content-title">{selectedArticle.title}</h1>
              <img
                src={selectedArticle.titlePhoto}
                alt={selectedArticle.title}
                className="article-content-image"
                onError={(e) => (e.target.src = '/placeholder.jpg')}
              />
              <div className="article-sections">
                {selectedArticle.sections?.map((section, index) => (
                  <div
                    key={index}
                    className="article-section"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                ))}
              </div>
              <button
                className="back-button"
                onClick={() => navigate('/articles')}
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

export default ArticlesPage;