import React from "react";
import { useGame } from "../context/GameContext";
import { DominoPiece } from "./DominoPiece";

export const DominoBoard = () => {
  const { gameState, handleDropPiece } = useGame();
  const { board, turn, players, playerId } = gameState;

  const handleDrop = (e) => {
    e.preventDefault();
    const piece = JSON.parse(e.dataTransfer.getData("domino"));
    handleDropPiece(piece, "auto");
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="bg-green-800 p-6 rounded-lg mt-4 flex flex-wrap justify-center items-center gap-2 min-h-[150px] shadow-inner"
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >
      {board.length === 0 ? (
        <p className="text-white text-lg">Aguardando primeira peça ser jogada...</p>
      ) : (
        board.map((piece, index) => (
          <DominoPiece key={index} piece={piece} small />
        ))
      )}
    </div>
  );
};
