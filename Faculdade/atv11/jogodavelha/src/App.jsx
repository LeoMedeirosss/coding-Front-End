import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import ResetButton from './components/ResetButton';
import './App.css';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const getComputerMove = (squares) => {
  const empty = squares.map((val, i) => (val === null ? i : null)).filter(i => i !== null);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
};

const App = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  useEffect(() => {
    if (!isPlayerTurn && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const move = getComputerMove(squares);
        if (move !== null) {
          const newSquares = [...squares];
          newSquares[move] = 'O';
          setSquares(newSquares);
          setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, squares, winner, isDraw]);

  const handleClick = (i) => {
    if (squares[i] || winner || !isPlayerTurn) return;
    const newSquares = [...squares];
    newSquares[i] = 'X';
    setSquares(newSquares);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  const status = winner
    ? `Vencedor: ${winner}`
    : isDraw
    ? 'Empate!'
    : isPlayerTurn
    ? 'Sua vez (X)'
    : 'Vez do computador (O)';

  return (
    <div className="app">
      <h1>Jogo da Velha</h1>
      <Board squares={squares} onClick={handleClick} />
      <GameInfo status={status} />
      <ResetButton onReset={resetGame} />
    </div>
  );
};

export default App;
