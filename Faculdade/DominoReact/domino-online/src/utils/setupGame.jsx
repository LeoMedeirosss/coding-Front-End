// src/utils/setupGame.js
import { shuffle } from "./shuffle";

export function generateInitialGameState() {
  const pieces = [];

  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      pieces.push({
        id: `${i}-${j}`,
        values: [i, j],
        inBoard: false,
        position: null,
      });
    }
  }

  const shuffled = shuffle(pieces);
  const hands = {
    player1: shuffled.slice(0, 6),
    player2: shuffled.slice(6, 12),
    player3: shuffled.slice(12, 18),
    player4: shuffled.slice(18, 24),
  };
  const dorme = shuffled.slice(24); // 4 peças

  return {
    hands,
    dorme,
    board: [],
    currentPlayer: "player1",
    players: ["player1", "player2", "player3", "player4"],
    round: 1,
    scores: { team1: 0, team2: 0 },
  };
}
