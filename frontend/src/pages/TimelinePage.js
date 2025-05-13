import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Timeline from '../components/Timeline/Timeline';
import '../styles/Timeline.css';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark');
  };

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <Header toggleTheme={toggleTheme} isDarkTheme={darkMode} />
      <main className="container" style={{ flex: 1, padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: darkMode ? '#E0E0E0' : '#333', marginBottom: '40px', letterSpacing: '-0.02em' }}>Лента времени</h1>
        <Timeline darkMode={darkMode} />
      </main>
      <Footer />
    </div>
  );
};

export default TimelinePage;