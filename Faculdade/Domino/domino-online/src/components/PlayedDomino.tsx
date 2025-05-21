// src/components/PlayedDomino.tsx
import React from 'react';
import { PlayedPiece } from '../types/types';

interface PlayedDominoProps {
  piece: PlayedPiece;
  index: number;
}

const PlayedDomino: React.FC<PlayedDominoProps> = ({ piece, index }) => {
  // Estilo baseado na posição da peça no tabuleiro
  const getPositionStyle = () => {
    const baseStyle = {
      transform: '',
      left: '50%',
      top: '50%'
    };

    // Posicionamento progressivo das peças
    switch (piece.position) {
      case 'left':
        return { 
          ...baseStyle,
          transform: `translate(calc(-50% - ${100 + (index * 60)}px), -50%) rotate(0deg)`
        };
      case 'right':
        return {
          ...baseStyle,
          transform: `translate(calc(-50% + ${100 + (index * 60)}px), -50%) rotate(0deg)`
        };
      case 'middle':
        return {
          ...baseStyle,
          transform: 'translate(-50%, -50%) rotate(90deg)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div 
      className={`absolute w-16 h-8 bg-white rounded flex items-center justify-center shadow-md ${
        piece.position === 'middle' ? 'flex-col h-16 w-8' : 'flex-row'
      }`}
      style={getPositionStyle()}
    >
      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center mx-0.5">
        {piece.left}
      </div>
      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center mx-0.5">
        {piece.right}
      </div>
    </div>
  );
};

export default PlayedDomino;