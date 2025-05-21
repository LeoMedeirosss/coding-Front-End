import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { initialGameState, getNextPlayer, getValidMoves } from "../logic/gameUtils";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState());
  const timeoutRef = useRef(null);

  const advanceTurn = () => {
    setGameState((prev) => ({
      ...prev,
      currentPlayer: getNextPlayer(prev),
    }));
  };

  const playPiece = (playerId, pieceId, direction) => {
    const player = gameState.players[playerId];
    const piece = player.hand.find(p => p.id === pieceId);
    if (!piece) return;

    // Simples simulação: remover peça da mão e adicionar ao tabuleiro
    const newHand = player.hand.filter(p => p.id !== pieceId);
    const newBoard = [...gameState.board, { ...piece, direction, playerId }];

    // Atualizar cabeças (left/right)
    const newHeads = { ...gameState.boardHeads };
    if (direction === "left") {
      newHeads.left = piece.values[0] === newHeads.left ? piece.values[1] : piece.values[0];
    } else {
      newHeads.right = piece.values[0] === newHeads.right ? piece.values[1] : piece.values[0];
    }

    const newPlayers = {
      ...gameState.players,
      [playerId]: { ...player, hand: newHand }
    };

    clearTimeout(timeoutRef.current);
    setGameState(prev => ({
      ...prev,
      players: newPlayers,
      board: newBoard,
      boardHeads: newHeads,
      currentPlayer: getNextPlayer(prev),
    }));
  };

  // Jogada automática se passar de 20s
  useEffect(() => {
    if (!gameState.currentPlayer) return;

    const currentId = gameState.currentPlayer;
    const currentHand = gameState.players[currentId]?.hand || [];

    timeoutRef.current = setTimeout(() => {
      const validMoves = getValidMoves(currentHand, gameState.boardHeads);
      if (validMoves.length > 0) {
        // Se houver uma jogada possível, escolher uma aleatória
        const { piece, direction } = validMoves[Math.floor(Math.random() * validMoves.length)];
        playPiece(currentId, piece.id, direction);
      } else {
        // Caso não tenha jogada possível, apenas passa a vez
        advanceTurn();
      }
    }, 20000);

    return () => clearTimeout(timeoutRef.current);
  }, [gameState.currentPlayer]);

  return (
    <GameContext.Provider value={{ gameState, setGameState, playPiece }}>
      {children}
    </GameContext.Provider>
  );
};
