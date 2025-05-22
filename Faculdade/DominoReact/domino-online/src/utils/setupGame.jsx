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

export function canPlay(tile, left, right) {
  return tile[0] === left || tile[1] === left || tile[0] === right || tile[1] === right;
}

export function getPlayableTiles(hand, left, right) {
  return hand.filter(tile => canPlay(tile.values, left, right));
}

export function autoPlay(hand, left, right) {
  const options = getPlayableTiles(hand, left, right);
  if (options.length === 1) return options[0];
  if (options.length > 1) return options[Math.floor(Math.random() * options.length)];
  return null;
}

export function calculatePoints(type, basePoints = 1) {
  switch (type) {
    case 'carroca': return 2;
    case 'laelo': return 3;
    case 'cruzada': return 4;
    default: return basePoints;
  }
}

export function getMoveType(tile, left, right) {
  const [a, b] = tile;
  const isCarroca = a === b;
  const fitsLeft = a === left || b === left;
  const fitsRight = a === right || b === right;

  if (fitsLeft && fitsRight) {
    if (isCarroca && left === right && a === left) return 'cruzada';
    return 'laelo';
  }
  if (isCarroca) return 'carroca';
  return 'normal';
}

export function hasPlayable(hand, left, right) {
  return hand.some(tile => canPlay(tile.values, left, right));
}

export function calculateHandValue(hand) {
  return hand.reduce((sum, piece) => sum + piece.values[0] + piece.values[1], 0);
}

export function determineWinner(hands) {
  const team1Players = ['player1', 'player3'];
  const team2Players = ['player2', 'player4'];

  const team1Value = team1Players.reduce((sum, p) => sum + calculateHandValue(hands[p]), 0);
  const team2Value = team2Players.reduce((sum, p) => sum + calculateHandValue(hands[p]), 0);

  if (team1Value < team2Value) return { team: 'team1', type: 'fechou' };
  if (team2Value < team1Value) return { team: 'team2', type: 'fechou' };
  return { team: null, type: 'empate' };
}