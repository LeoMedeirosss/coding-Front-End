import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import { connectSocket } from './socket';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'home' | 'game'>('home');
  const [error, setError] = useState('');

  const handleJoin = (name: string) => {
    connectSocket(name);
    
    // Listeners para eventos do socket
    const onRoomFull = () => setError('Room is full');
    const onNameTaken = () => setError('Name is already taken');
    const onGameStart = () => setScreen('game');

    socket.on('roomFull', onRoomFull);
    socket.on('nameTaken', onNameTaken);
    socket.on('gameStart', onGameStart);

    return () => {
      socket.off('roomFull', onRoomFull);
      socket.off('nameTaken', onNameTaken);
      socket.off('gameStart', onGameStart);
    };
  };

  return (
    <div className="min-h-screen bg-green-800 text-white">
      {screen === 'home' ? (
        <HomeScreen onJoin={handleJoin} error={error} />
      ) : (
        <GameScreen />
      )}
    </div>
  );
};

export default App;