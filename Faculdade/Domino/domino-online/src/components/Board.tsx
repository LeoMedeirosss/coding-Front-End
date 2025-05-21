// src/components/Board.tsx
import React from 'react';
import { useDrop } from 'react-dnd';
import { DominoPiece, BoardState } from '../types/types';
import PlayedDomino from './PlayedDomino';

interface BoardProps {
  boardState: BoardState;
  onPieceDropped: (piece: DominoPiece, position: 'left' | 'right') => void;
}

const Board: React.FC<BoardProps> = ({ boardState, onPieceDropped }) => {
  const [, leftDrop] = useDrop(() => ({
    accept: 'DOMINO_PIECE',
    drop: (item: { piece: DominoPiece }) => {
      onPieceDropped(item.piece, 'left');
    },
  }));

  const [, rightDrop] = useDrop(() => ({
    accept: 'DOMINO_PIECE',
    drop: (item: { piece: DominoPiece }) => {
      onPieceDropped(item.piece, 'right');
    },
  }));

  return (
    <div className="relative bg-amber-100 rounded-lg p-4 mb-6 h-64">
      {/* Área para jogar na cabeça esquerda */}
      <div
        ref={leftDrop}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-32 border-2 border-dashed border-gray-500 flex items-center justify-center"
      >
        {boardState.heads[0] !== -1 && (
          <span className="text-2xl font-bold">{boardState.heads[0]}</span>
        )}
      </div>

      {/* Área para jogar na cabeça direita */}
      <div
        ref={rightDrop}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-32 border-2 border-dashed border-gray-500 flex items-center justify-center"
      >
        {boardState.heads[1] !== -1 && (
          <span className="text-2xl font-bold">{boardState.heads[1]}</span>
        )}
      </div>

      {/* Peças já jogadas */}
      {boardState.pieces.map((piece, index) => (
        <PlayedDomino key={index} piece={piece} />
      ))}
    </div>
  );
};

export default Board;