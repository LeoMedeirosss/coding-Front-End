import React from 'react';

function Card({ carta, onClick }) {
  return (
    <div 
      className={`card ${carta.revelada ? 'revealed' : ''} ${carta.encontrada ? 'encontrada' : ''}`}
      onClick={onClick}
    >
      <div>{carta.revelada || carta.encontrada ? carta.simbolo : ''}</div>
    </div>
  );
}

export default Card;