import React from 'react';
import { GameState } from '../types/types';

const ScoreBoard: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  return (
    <div className="bg-green-900 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <div className="text-center">
          <h3 className="font-bold">TEAM 1</h3>
          <p>{gameState.teams[0].join(' & ')}</p>
          <p className="text-2xl font-bold">{gameState.scores[0]}</p>
        </div>
        
        <div className="text-center">
          <p className="text-sm">Round {gameState.round}</p>
          {gameState.multiplier > 1 && (
            <p className="text-yellow-300">Multiplier: x{gameState.multiplier}</p>
          )}
        </div>
        
        <div className="text-center">
          <h3 className="font-bold">TEAM 2</h3>
          <p>{gameState.teams[1].join(' & ')}</p>
          <p className="text-2xl font-bold">{gameState.scores[1]}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;