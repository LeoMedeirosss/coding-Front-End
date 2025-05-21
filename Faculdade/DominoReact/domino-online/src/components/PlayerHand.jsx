import React from "react";
import { useGame } from "../context/GameContext";

export default function PlayerHand({ playerId }) {
  const { gameState, playPiece } = useGame();
  const hand = gameState.players[playerId]?.hand || [];
  const isTurn = gameState.currentPlayer === playerId;

  const onDragStart = (e, pieceId) => {
    e.dataTransfer.setData("pieceId", pieceId);
  };

  const onDoubleClick = (pieceId) => {
    // Verifica se há apenas uma cabeça onde a peça encaixa e joga automaticamente
    const piece = hand.find((p) => p.id === pieceId);
    if (!piece || !isTurn) return;

    const heads = gameState.boardHeads;
    const matchLeft = heads?.left !== undefined && (piece.values[0] === heads.left || piece.values[1] === heads.left);
    const matchRight = heads?.right !== undefined && (piece.values[0] === heads.right || piece.values[1] === heads.right);

    if (matchLeft && !matchRight) {
      playPiece(playerId, pieceId, "left");
    } else if (matchRight && !matchLeft) {
      playPiece(playerId, pieceId, "right");
    }
    // Caso tenha mais de uma opção ou nenhuma, não faz nada
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <h2 className="text-lg text-white font-bold mb-1">Suas Peças ({playerId})</h2>
      <div className={`flex gap-2 p-2 rounded-md ${isTurn ? "bg-blue-900" : "bg-gray-800"} border`}>
        {hand.map((p) => (
          <div
            key={p.id}
            draggable={isTurn}
            onDragStart={(e) => onDragStart(e, p.id)}
            onDoubleClick={() => onDoubleClick(p.id)}
            className="w-14 h-20 bg-white text-black rounded shadow flex flex-col items-center justify-center cursor-move border border-gray-700 hover:scale-105 transition-transform"
          >
            <div className="font-bold">{p.values[0]}</div>
            <div className="font-bold">{p.values[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
