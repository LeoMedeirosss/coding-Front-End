import { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { DominoPiece } from "./DominoPiece";
import { DominoBoard } from "./DominoBoard";
import {
  autoPlay,
  getPlayableTiles,
  getMoveType,
  calculatePoints,
  hasPlayable,
  determineWinner,
  calculateHandValue
} from '../utils/setupGame';

export const GameBoard = () => {
  const { gameState, playerId, handleDropPiece } = useGame();

  const currentPlayer = gameState.players.find(p => p.id === playerId);
  const isPlayerTurn = gameState.turn === gameState.players.findIndex(p => p.id === playerId);

  useEffect(() => {
  if (!isPlayerTurn || !playerHand || playerHand.length === 0) return;

  const timeoutId = setTimeout(() => {
    const board = gameState.board;
    const left = board.length ? board[0].values[0] : null;
    const right = board.length ? board[board.length - 1].values[1] : null;

    const chosen = autoPlay(playerHand, left, right);

    if (chosen) {
      handleDropPiece(chosen, "auto");
    } else {
      // Jogador passa
      handleDropPiece(null, "pass");
    }
  }, 20000); // 20 segundos

  return () => clearTimeout(timeoutId);
  }, [gameState.turn]);

  if (!currentPlayer) {
    return <div className="text-white">Aguardando entrada na sala...</div>;
  }

  const playerHand = currentPlayer.hand;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-2">Você é: {currentPlayer.name}</h2>
      <p className="mb-4">
        {isPlayerTurn ? "🎯 Sua vez de jogar!" : "⏳ Aguardando outros jogadores..."}
      </p>

      <DominoBoard />

      <div className="mt-6">
        <h3 className="text-xl mb-2">Suas peças:</h3>
        <div className="flex flex-wrap gap-2">
          {playerHand.map((piece, index) => (
            <DominoPiece
              key={index}
              piece={piece}
              draggable={isPlayerTurn}
              onDoubleClick={() => handleDropPiece(piece, "auto")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
