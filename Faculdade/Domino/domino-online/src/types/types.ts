export interface DominoPiece {
  left: number;
  right: number;
  id?: string;
}

export interface Player {
  id: string;
  name: string;
  team?: number;
  pieces: DominoPiece[];
}

export interface PlayedPiece extends DominoPiece {
  playerId: string;
  playedAt: Date;
  position: 'left' | 'right' | 'middle';
}

export interface BoardState {
  pieces: PlayedPiece[];
  heads: [number, number];
}

export interface GameState {
  players: Player[];
  teams: [string[], string[]];
  currentTurn: string | null;
  board: BoardState;
  scores: [number, number];
  multiplier: number;
  round: number;
  gameEnded: boolean;
  winnerTeam?: number;
}