import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameState } from '../types/types';
import { socket } from '../socket';
import Board from './Board';
import ScoreBoard from './ScoreBoard';
import PlayerHand from './PlayerHand';
import TurnIndicator from './TurnIndicator';
import GameOverModal from './GameOverModal';

const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myId, setMyId] = useState('');

  useEffect(() => {
    socket.on('gameStateUpdate', (state: GameState) => {
      setGameState(state);
    });

    socket.on('yourId', (id: string) => {
      setMyId(id);
    });

    return () => {
      socket.off('gameStateUpdate');
      socket.off('yourId');
    };
  }, []);

  const handlePiecePlay = (piece: DominoPiece, position: 'left' | 'right') => {
    socket.emit('playPiece', { piece, position });
  };

  const handleRestart = () => {
    socket.emit('restartGame');
  };

  if (!gameState) return <div>Loading game...</div>;

  const myPlayer = gameState.players.find(p => p.id === myId);
  const currentTurn = gameState.currentTurn === myId;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <ScoreBoard gameState={gameState} />
        
        <TurnIndicator gameState={gameState} myId={myId} />
        
        <Board boardState={gameState.board} />
        
        {myPlayer && (
          <PlayerHand
            pieces={myPlayer.pieces}
            onPiecePlay={handlePiecePlay}
            currentTurn={currentTurn}
            heads={gameState.board.heads}
          />
        )}
        
        <GameOverModal 
          gameState={gameState} 
          onRestart={handleRestart} 
        />
      </div>
    </DndProvider>
  );
};

export default GameScreen;