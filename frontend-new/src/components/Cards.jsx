import React from 'react';
import './Cards.css';

const Cards = () => {
  const cardsData = [
    {
      number: '01',
      title: 'Card One',
      text: 'This is a short description for card one.',
    },
    {
      number: '02',
      title: 'Card Two',
      text: 'This is a short description for card two.',
    },
    {
      number: '03',
      title: 'Card Three',
      text: 'This is a short description for card three.',
    },
    {
        number: '04',
        title: 'Card Four',
        text: 'This is a short description for card four.',
    },
    {
        number: '05',
        title: 'Card Five',
        text: 'This is a short description for card five.',
    },
  ];

  return (
    <div className="card-container">
      {cardsData.map((card, index) => (
        <div className="card" key={index}>
          <div className="card-pin"></div>
          <div className="card-number">{card.number}</div>
          <div className="card-content">
            <h2 className="card-title">{card.title}</h2>
            <p className="card-text">{card.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
