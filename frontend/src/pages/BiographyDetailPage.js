import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import apiClient from '../apiClient';
import '../styles/BiographyDetail.css';

const BiographyDetailPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [biography, setBiography] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBiography = async () => {
      try {
        const data = await apiClient(`/api/v1/biographies/get?url=${encodeURIComponent(url)}`);
        setBiography(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBiography();
  }, [url]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark');
  };

  if (loading) {
    return (
      <div className={darkMode ? 'dark-theme' : 'light-theme'}>
        <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка биографии...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={darkMode ? 'dark-theme' : 'light-theme'}>
        <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
        <div className="error-container">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/biographies')} className="back-button">
            Вернуться к списку биографий
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
      <main className="biography-container">
        <div className="biography-header">
          <h1>{biography.title}</h1>
          {biography.titlePhoto && (
            <img 
              src={biography.titlePhoto} 
              alt={biography.title} 
              className="biography-title-photo"
            />
          )}
        </div>
        
        <div className="biography-content">
          {biography.sections.map((section, index) => (
            <section key={index} className="biography-section">
              <h2>{section.heading}</h2>
              <div 
                className="section-content"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BiographyDetailPage; 