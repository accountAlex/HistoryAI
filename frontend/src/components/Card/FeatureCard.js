import React from 'react';
import '../../styles/Card.css';

const FeatureCard = ({title, description, date, isLeft, darkMode}) => {
    return (
        <div className={`feature-card ${isLeft ? 'left' : 'right'}`}>
            <div className="card-content" style={{
                background: darkMode ? '#1A1A1A' : '#FFF',
                border: `1px solid ${darkMode ? '#2A2A2A' : '#E0E0E0'}`,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{
                    textTransform: 'none',
                    letterSpacing: '-0.02em',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: darkMode ? '#E0E0E0' : '#333'
                }}>{title}</h3>
                <p style={{color: darkMode ? '#999' : '#666', fontSize: '0.9rem', lineHeight: '1.5'}}>{description}</p>
                <span className="card-date" style={{
                    color: darkMode ? '#666' : '#999',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                }}>{new Date(date).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default FeatureCard;