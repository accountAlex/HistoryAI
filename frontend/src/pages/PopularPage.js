import React, {useState, useEffect} from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import apiClient from '../apiClient';
import '../styles/Card.css';
import CardDropdown from '../components/CardDropdown/CardDropdown';

const PopularPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [popularItems, setPopularItems] = useState([]);
    const [error, setError] = useState(null);

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
        document.body.classList.toggle('dark');
    };

    return (
        <div className={darkMode ? 'dark-theme' : 'light-theme'}>
            <Header toggleTheme={toggleTheme} isDarkTheme={darkMode}/>
            <main className="container mx-auto px-4 py-12">
                {error && <p className="text-red-500 text-center">{error}</p>}
                {popularItems.length === 0 && !error}
                <main className="container"
                      style={{flex: 1, padding: '40px 20px', maxWidth: '1000px', margin: '0 auto'}}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: darkMode ? '#E0E0E0' : '#333',
                        marginBottom: '40px',
                        letterSpacing: '-0.02em'
                    }}>Топ "Что если?"</h1>
                    <CardDropdown darkMode={darkMode}/>
                </main>
            </main>
            <Footer/>
        </div>
    );
};

export default PopularPage;