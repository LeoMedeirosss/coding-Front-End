import React from 'react';
import { DominoPiece } from '../types/types';
import DominoPiece from './DominoPiece';

interface PlayerHandProps {
  pieces: DominoPiece[];
  onPiecePlay: (piece: DominoPiece, position: 'left' | 'right') => void;
  currentTurn: boolean;
  heads: [number, number];
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  pieces, 
  onPiecePlay, 
  currentTurn,
  heads 
}) => {
  const handleDoubleClick = (piece: DominoPiece) => {
    if (!currentTurn) return;
    
    // Verifica se pode jogar em alguma cabeça
    const [leftHead, rightHead] = heads;
    const canPlayLeft = piece.left === leftHead || piece.right === leftHead;
    const canPlayRight = piece.left === rightHead || piece.right === rightHead;

    if (canPlayLeft && !canPlayRight) {
      onPiecePlay(piece, 'left');
    } else if (!canPlayLeft && canPlayRight) {
      onPiecePlay(piece, 'right');
    }
    // Se pode nas duas, não faz nada no double click
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-green-900 p-4">
      <div className="flex justify-center flex-wrap gap-2">
        {pieces.map((piece, i) => (
          <DominoPiece
            key={`${piece.left}-${piece.right}-${i}`}
            piece={piece}
            onDoubleClick={() => handleDoubleClick(piece)}
            disabled={!currentTurn}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;