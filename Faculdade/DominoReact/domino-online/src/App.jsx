// src/App.jsx
import { GameProvider } from "./context/GameContext";
import { GameBoard } from "./components/GameBoard";

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-green-800 flex items-center justify-center text-white">
        <GameBoard />
      </div>
    </GameProvider>
  );
}

export default App;
