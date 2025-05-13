import React from 'react';
import FeatureCard from '../Card/FeatureCard';
import '../../styles/Timeline.css';

const Timeline = ({ darkMode }) => {
  const events = [
    { id: 1, date: '2025-05-01', title: 'Запуск ZXChat', description: 'Официальный запуск чат-приложения.' },
    { id: 2, date: '2025-04-15', title: 'Начало разработки', description: 'Старт проекта ZXCoding MISIS.' },
    { id: 3, date: '2025-03-10', title: 'Идея проекта', description: 'Первая концепция чат-платформы.' },
  ];

  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      {events.map((event, index) => (
        <FeatureCard
          key={event.id}
          title={event.title}
          description={event.description}
          date={event.date}
          isLeft={index % 2 === 0}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default Timeline;