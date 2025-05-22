import { useGame } from "../context/GameContext";

export const Scoreboard = () => {
  const { gameState } = useGame();
  const { players, currentPlayer, round = 1, scores = { team1: 0, team2: 0 } } = gameState;

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg w-full max-w-4xl mx-auto mt-4 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-bold">Rodada {round}</h2>
          <p>
            <span className="text-green-400 font-semibold">Vez de:</span>{" "}
            <span className="font-bold">{currentPlayer}</span>
          </p>
        </div>
        <div className="text-right">
          <p><span className="text-blue-300">Dupla 1</span>: player1 e player3</p>
          <p><span className="text-pink-300">Dupla 2</span>: player2 e player4</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-center">
        {["player1", "player2", "player3", "player4"].map((pid, idx) => (
          <div
            key={pid}
            className={`p-2 rounded border ${
              currentPlayer === pid ? "bg-yellow-300 text-black font-bold" : "bg-gray-700"
            }`}
          >
            {pid} - {players[pid]?.hand.length ?? 0} peça(s)
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between font-bold">
        <span className="text-blue-400">Pontuação Dupla 1: {scores.team1}</span>
        <span className="text-pink-400">Pontuação Dupla 2: {scores.team2}</span>
      </div>
    </div>
  );
};
