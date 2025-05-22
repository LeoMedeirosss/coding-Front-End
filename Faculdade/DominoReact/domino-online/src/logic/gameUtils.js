export const initialGameState = () => ({
  players: {
    player1: { hand: [] },
    player2: { hand: [] },
    player3: { hand: [] },
    player4: { hand: [] },
  },
  board: [],
  boardHeads: { left: undefined, right: undefined },
  currentPlayer: "player1",
  round: 1,
  scores: { team1: 0, team2: 0 },
});


// Ordem dos turnos fixa
export const getNextPlayer = (state) => {
  const order = ["player1", "player2", "player3", "player4"];
  const currentIndex = order.indexOf(state.currentPlayer);
  return order[(currentIndex + 1) % order.length];
};

// Encontra peças jogáveis
export const getValidMoves = (hand, heads) => {
  return hand.flatMap((piece) => {
    const canPlayLeft = heads.left !== undefined &&
      (piece.values[0] === heads.left || piece.values[1] === heads.left);
    const canPlayRight = heads.right !== undefined &&
      (piece.values[0] === heads.right || piece.values[1] === heads.right);

    const moves = [];
    if (canPlayLeft) moves.push({ piece, direction: "left" });
    if (canPlayRight) moves.push({ piece, direction: "right" });

    return moves;
  });
};
