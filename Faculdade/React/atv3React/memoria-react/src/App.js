import React, { useState } from 'react';
import './App.css';
import Setup from './components/Setup';
import GameBoard from './components/GameBoard';
import VictoryScreen from './components/VictoryScreen';

const imagens = [
  "🍎", "🚗", "🐶", "⚽", "🎵", "🧠", "🎲", "🚀",
  "🌈", "📱", "🎮", "👓", "📚", "🍕", "🐱", "🏀"
];

function App() {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'victory'
  const [gameConfig, setGameConfig] = useState({
    jogadores: [],
    pontuacoes: [],
    jogadorAtual: 0,
    cartas: [],
    totalPares: 0,
    paresEncontrados: 0
  });

  const startGame = (config) => {
    setGameState('playing');
    setGameConfig(config);
  };

  const endGame = (finalScores) => {
    setGameState('victory');
    setGameConfig(prev => ({
      ...prev,
      pontuacoes: finalScores
    }));
  };

  const restartGame = () => {
    setGameState('setup');
    setGameConfig({
      jogadores: [],
      pontuacoes: [],
      jogadorAtual: 0,
      cartas: [],
      totalPares: 0,
      paresEncontrados: 0
    });
  };

  return (
    <div className="App">
      <h1>Jogo da Memória</h1>

      {gameState === 'setup' && (
        <Setup imagens={imagens} onStart={startGame} />
      )}

      {gameState === 'playing' && (
        <GameBoard 
          config={gameConfig} 
          imagens={imagens} 
          onGameEnd={endGame} 
        />
      )}

      {gameState === 'victory' && (
        <VictoryScreen 
          jogadores={gameConfig.jogadores} 
          pontuacoes={gameConfig.pontuacoes} 
          onRestart={restartGame} 
        />
      )}
    </div>
  );
}

export default App;