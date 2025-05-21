import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

interface Player {
  id: string;
  name: string;
  team?: number;
  pieces: DominoPiece[];
}

interface DominoPiece {
  left: number;
  right: number;
}

interface GameState {
  players: Player[];
  teams: [string[], string[]];
  currentTurn: string | null;
  board: BoardState;
  scores: [number, number];
  multiplier: number;
  round: number;
  gameEnded: boolean;
}

interface BoardState {
  pieces: PlayedPiece[];
  heads: [number, number];
}

interface PlayedPiece extends DominoPiece {
  playerId: string;
  playedAt: Date;
  position: 'left' | 'right' | 'middle';
}

let gameState: GameState = {
  players: [],
  teams: [[], []],
  currentTurn: null,
  board: {
    pieces: [],
    heads: [-1, -1]
  },
  scores: [0, 0],
  multiplier: 1,
  round: 1,
  gameEnded: false
};

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  
  // Handle player joining
  socket.on('join', (name: string) => {
    if (gameState.players.length >= 4) {
      socket.emit('roomFull');
      return;
    }
    
    if (gameState.players.some(p => p.name === name)) {
      socket.emit('nameTaken');
      return;
    }
    
    const newPlayer: Player = {
      id: socket.id,
      name,
      pieces: []
    };
    
    gameState.players.push(newPlayer);
    io.emit('playersUpdate', gameState.players.map(p => p.name));
    
    // Start game when 4 players join
    if (gameState.players.length === 4) {
      assignTeams();
      startNewRound();
    }
  });
  
  // Handle player move
  socket.on('move', (piece: DominoPiece, position: 'left' | 'right') => {
    // Validate move
    // Update game state
    // Check for round/game end
    // Broadcast update
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    io.emit('playersUpdate', gameState.players.map(p => p.name));
  });
});

function assignTeams() {
  // Randomly assign players to teams
  const shuffled = [...gameState.players].sort(() => 0.5 - Math.random());
  gameState.teams = [
    [shuffled[0].name, shuffled[1].name],
    [shuffled[2].name, shuffled[3].name]
  ];
  shuffled[0].team = 0;
  shuffled[1].team = 0;
  shuffled[2].team = 1;
  shuffled[3].team = 1;
}

function startNewRound() {
  // Reset board
  gameState.board = {
    pieces: [],
    heads: [-1, -1]
  };
  
  // Distribute pieces
  const allPieces = generateDominoPieces();
  shufflePieces(allPieces);
  
  gameState.players.forEach(player => {
    player.pieces = allPieces.splice(0, 6);
  });
  
  // Determine first player based on highest double
  // Set currentTurn
  // Broadcast new round start
}

function generateDominoPieces(): DominoPiece[] {
  const pieces: DominoPiece[] = [];
  for (let left = 0; left <= 6; left++) {
    for (let right = left; right <= 6; right++) {
      pieces.push({ left, right });
    }
  }
  return pieces;
}

function shufflePieces(pieces: DominoPiece[]) {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
}

httpServer.listen(3001, () => {
  console.log('Server running on port 3001');
});