import { React, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../../styles/CardDropdown.css';
import { response1, response2, response3, response4, response5, response6 } from '../../constants/PopularResponses';

const CardDropdown = () => {
    const [openId, setOpenId] = useState(null);

    const handleToggle = (id) => {
        setOpenId(prev => (prev === id ? null : id));
    };

  const events = [
    {
      id: 1,
      title: 'Что, если бы СССР не развалился в 1991 году?',
      description: response1
    },
    {
      id: 2,
      title: 'Что, если бы Октябрьская революция не состоялась?',
      description: response2
    },
    {
      id: 3,
      title: 'Что, если бы Наполеон выиграл войну 1812 года?',
      description: response3
    },
    {
      id: 4,
      title: 'Что, если бы Пётр I не провёл европейские реформы?',
      description: response4
    },
    {
      id: 5,
      title: 'Что, если бы Романовы не пришли к власти в 1613 году?',
      description: response5
    },
    {
      id: 6,
      title: 'Что, если бы Дмитрий Донской не победил на Куликовом поле?',
      description: response6
    }
  ];

  return (
    <div className="timeline-container">
    <div className="timeline-grid">
        {events.map((event) => (
        <div key={event.id} className="timeline-content" onClick={() => handleToggle(event.id)}>
            <h3 className="timeline-title">{event.title}</h3>
            <div className={`timeline-description-wrapper ${openId === event.id ? 'open' : ''}`}>
              <p className="timeline-description"><ReactMarkdown>{event.description}</ReactMarkdown></p>
            </div>
        </div>
        ))}
    </div>
    </div>
  );
};

export default CardDropdown;