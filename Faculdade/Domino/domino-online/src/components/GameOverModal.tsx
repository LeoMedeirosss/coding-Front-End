import React from 'react';
import { GameState } from '../types/types';

const GameOverModal: React.FC<{ 
  gameState: GameState; 
  onRestart: () => void 
}> = ({ gameState, onRestart }) => {
  if (!gameState.gameEnded) return null;

  const winnerTeam = gameState.winnerTeam!;
  const winnerNames = gameState.teams[winnerTeam].join(' and ');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-green-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-4">Game Over!</h2>
        <p className="text-xl text-center mb-6">
          Team {winnerTeam + 1} ({winnerNames}) wins!
        </p>
        <div className="flex justify-center">
          <button
            onClick={onRestart}
            className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded font-bold"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;