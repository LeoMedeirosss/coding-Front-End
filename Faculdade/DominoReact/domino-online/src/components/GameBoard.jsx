import React from "react";
import { useGame } from "../context/GameContext";

export default function GameBoard() {
  const { gameState, playPiece } = useGame();
  const board = gameState.board || [];

  const handleDrop = (e, side) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("pieceId");
    // Aqui está fixo para player1, depois será dinâmico
    playPiece("player1", pieceId, side);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <h2 className="text-xl font-bold text-white mb-2">Tabuleiro</h2>
      <div className="flex items-center justify-center">
        {/* Dropzone esquerda */}
        <div
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, "left")}
          className="w-16 h-32 bg-yellow-300 rounded-l-md flex items-center justify-center text-black font-bold cursor-pointer"
        >
          ←
        </div>

        {/* Área central com peças */}
        <div className="bg-green-700 h-32 min-w-[300px] rounded flex justify-center items-center text-lg text-white mx-2 px-2 overflow-x-auto">
          {board.length === 0 ? (
            <span className="text-white font-mono">Tabuleiro vazio</span>
          ) : (
            board.map((p, i) => (
              <div
                key={i}
                className="w-10 h-14 bg-white text-black mx-1 text-center border rounded shadow"
              >
                <div>{p.values[0]}</div>
                <div>{p.values[1]}</div>
              </div>
            ))
          )}
        </div>

        {/* Dropzone direita */}
        <div
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, "right")}
          className="w-16 h-32 bg-yellow-300 rounded-r-md flex items-center justify-center text-black font-bold cursor-pointer"
        >
          →
        </div>
      </div>
    </div>
  );
}
