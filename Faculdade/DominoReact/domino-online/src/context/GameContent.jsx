import React, { createContext, useContext, useEffect, useState } from "react";
import { generateInitialState, shuffleDominoes } from "../utils/gameUtils";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(generateInitialState());
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    // Em breve: carregar do servidor. Por ora, apenas inicialização local.
  }, []);

  const joinGame = (name) => {
    if (gameState.players.length >= 4) return { success: false, message: "Sala cheia" };
    if (gameState.players.some(p => p.name === name)) return { success: false, message: "Nome duplicado" };

    const id = crypto.randomUUID();
    const newPlayer = { id, name, hand: [] };

    const updatedPlayers = [...gameState.players, newPlayer];

    // Quando o quarto jogador entra, iniciar o jogo
    if (updatedPlayers.length === 4) {
      const shuffled = shuffleDominoes();
      for (let i = 0; i < 4; i++) {
        updatedPlayers[i].hand = shuffled.slice(i * 6, (i + 1) * 6);
      }
      const dorme = shuffled.slice(24);

      setGameState({
        ...gameState,
        players: updatedPlayers,
        dorme,
        board: [],
        turn: 0,
      });
    } else {
      setGameState({ ...gameState, players: updatedPlayers });
    }

    setPlayerId(id);
    return { success: true };
  };

  const isPlayerTurn = () => {
    const index = gameState.players.findIndex(p => p.id === playerId);
    return gameState.turn === index;
  };

  const handleDropPiece = (piece, method = "auto") => {
    if (!isPlayerTurn()) return;

    const board = gameState.board;
    const [a, b] = piece;
    const head = board[0]?.[0];
    const tail = board[board.length - 1]?.[1];

    const fitsHead = head !== undefined && (a === head || b === head);
    const fitsTail = tail !== undefined && (a === tail || b === tail);
    const isFirstMove = board.length === 0;

    if (!isFirstMove && !fitsHead && !fitsTail) return;

    const newBoard = [...board];
    if (isFirstMove) {
      newBoard.push(piece);
    } else if (fitsHead) {
      newBoard.unshift(a === head ? piece : [b, a]);
    } else if (fitsTail) {
      newBoard.push(a === tail ? piece : [b, a]);
    }

    const updatedPlayers = gameState.players.map((p) => {
      if (p.id !== playerId) return p;
      return {
        ...p,
        hand: p.hand.filter(
          (x) => !(x[0] === piece[0] && x[1] === piece[1])
        ),
      };
    });

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      players: updatedPlayers,
      turn: (prev.turn + 1) % 4,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        playerId,
        joinGame,
        handleDropPiece,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);