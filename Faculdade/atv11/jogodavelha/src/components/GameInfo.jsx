import React from 'react';
import './GameInfo.css';

const GameInfo = ({ status }) => (
  <div className="game-info">{status}</div>
);

export default GameInfo;
