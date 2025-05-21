import React from 'react';
import { GameState } from '../types/types';

const TurnIndicator: React.FC<{ gameState: GameState; myId: string }> = ({ 
  gameState, 
  myId 
}) => {
  const isMyTurn = gameState.currentTurn === myId;
  const currentPlayer = gameState.players.find(p => p.id === gameState.currentTurn);
  
  return (
    <div className={`p-2 mb-4 rounded text-center ${
      isMyTurn ? 'bg-yellow-600' : 'bg-gray-700'
    }`}>
      {isMyTurn ? (
        <p className="font-bold">YOUR TURN!</p>
      ) : (
        <p>Waiting for {currentPlayer?.name || 'opponent'}...</p>
      )}
    </div>
  );
};

export default TurnIndicator;