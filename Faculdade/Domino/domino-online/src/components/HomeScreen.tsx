import React, { useState } from 'react';

interface HomeScreenProps {
  onJoin: (name: string) => void;
  error: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onJoin, error }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Domino Online</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-green-700 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Game Rules</h2>
          {/* Regras detalhadas aqui */}
        </div>
        
        <div className="bg-green-700 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join Game</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Your Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded text-black"
              />
            </div>
            
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-bold"
            >
              Play
            </button>
            
            {error && <p className="text-red-300">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;