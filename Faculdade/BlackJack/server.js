const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/style.css') {
    fs.readFile(path.join(__dirname, 'style.css'), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading style.css');
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
  } else if (req.url === '/client.js') {
    fs.readFile(path.join(__dirname, 'client.js'), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading client.js');
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const wss = new WebSocket.Server({ server });

const rooms = {};

function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const roomCode = generateRoomCode();
rooms[roomCode] = {
  players: [],
  deck: [],
  dealerHand: [],
  currentRound: 0,
  maxRounds: 3,
  moveTimeout: 15,
  gameStarted: false,
  dealerBalance: 0,
  bets: []
};

console.log(`Room created with code: ${roomCode}`);

function createDeck() {
  const suits = ['♠', '♣', '♥', '♦'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  for (let card of hand) {
    if (card.value === 'A') {
      aces++;
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }
  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  }
  return value;
}

wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
  const clientRoomCode = urlParams.get('roomCode');

  if (!clientRoomCode || !rooms[clientRoomCode]) {
    ws.send(JSON.stringify({ type: 'error', message: 'Invalid room code' }));
    ws.close();
    return;
  }

  const gameState = rooms[clientRoomCode];

  if (gameState.players.length >= 4) {
    ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
    ws.close();
    return;
  }

  const playerId = gameState.players.length + 1;
  gameState.players.push({ id: playerId, ws, hand: [], balance: 50, status: 'waiting', name: '' });
  ws.send(JSON.stringify({ type: 'playerId', playerId }));

  if (gameState.players.length === 1) {
    ws.send(JSON.stringify({ type: 'host', message: `You are the host. Room code: ${clientRoomCode}` }));
  } else {
    ws.send(JSON.stringify({ type: 'client', message: 'Enter your name to join.' }));
    if (gameState.players.length >= 2) {
      gameState.players[0].ws.send(JSON.stringify({ type: 'readyToStart', message: `${gameState.players.length} players joined. You can start the game.` }));
    }
  }

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'setName') {
      const player = gameState.players.find(p => p.id === data.playerId);
      player.name = data.name || `Player ${player.id}`;
      gameState.players.forEach(p => {
        p.ws.send(JSON.stringify({ type: 'updatePlayers', players: gameState.players.map(pl => ({ id: pl.id, name: pl.name, balance: pl.balance })) }));
      });
    }

    if (data.type === 'settings') {
      gameState.maxRounds = Math.max(3, parseInt(data.maxRounds));
      gameState.moveTimeout = Math.max(5, parseInt(data.moveTimeout));
      gameState.players.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'settingsConfirmed', maxRounds: gameState.maxRounds, moveTimeout: gameState.moveTimeout }));
      });
    }

    if (data.type === 'placeBet') {
      const player = gameState.players.find(p => p.id === data.playerId);
      const bet = parseInt(data.bet);
      if (bet >= 10 && bet <= player.balance && player.status === 'waiting') {
        player.status = 'betPlaced';
        gameState.bets.push({ playerId: player.id, amount: bet });
        player.balance -= bet;
        gameState.players.forEach(p => {
          p.ws.send(JSON.stringify({ type: 'betPlaced', playerId: player.id, bet, balance: player.balance }));
        });
        if (gameState.players.every(p => p.status === 'betPlaced')) {
          gameState.gameStarted = true;
          startNewRound(clientRoomCode);
        }
      }
    }

    if (data.type === 'startGame' && gameState.players.length >= 2 && !gameState.gameStarted) {
      gameState.gameStarted = true;
      gameState.players.forEach(player => {
        player.status = 'waiting';
        player.ws.send(JSON.stringify({ type: 'promptBet', message: 'Place your bet for the round (minimum R$10).' }));
      });
    }

    if (data.type === 'hit' && gameState.gameStarted) {
      const player = gameState.players.find(p => p.id === data.playerId);
      if (player.status === 'playing') {
        const card = gameState.deck.pop();
        player.hand.push(card);
        const handValue = calculateHandValue(player.hand);
        if (handValue > 21) {
          player.status = 'bust';
          gameState.players.forEach(p => {
            p.ws.send(JSON.stringify({ type: 'bust', playerId: player.id }));
          });
        }
        gameState.players.forEach(p => {
          p.ws.send(JSON.stringify({ type: 'updateHand', playerId: player.id, hand: player.hand }));
        });
        checkRoundEnd(clientRoomCode);
      }
    }

    if (data.type === 'stand' && gameState.gameStarted) {
      const player = gameState.players.find(p => p.id === data.playerId);
      if (player.status === 'playing') {
        player.status = 'stand';
        gameState.players.forEach(p => {
          p.ws.send(JSON.stringify({ type: 'stand', playerId: player.id }));
        });
        checkRoundEnd(clientRoomCode);
      }
    }
  });

  ws.on('close', () => {
    gameState.players = gameState.players.filter(p => p.ws !== ws);
    if (gameState.players.length < 2) {
      gameState.gameStarted = false;
      gameState.players.forEach(p => {
        p.ws.send(JSON.stringify({ type: 'playerLeft', message: 'Not enough players. Waiting for more players.' }));
      });
    } else {
      gameState.players.forEach(p => {
        p.ws.send(JSON.stringify({ type: 'playerLeft', message: `A player has left. ${gameState.players.length} players remain.` }));
      });
    }
  });
});

function startNewRound(roomCode) {
  const gameState = rooms[roomCode];
  gameState.currentRound++;
  gameState.deck = createDeck();
  shuffleDeck(gameState.deck);
  gameState.dealerHand = [gameState.deck.pop(), gameState.deck.pop()];
  gameState.players.forEach(player => {
    player.hand = [gameState.deck.pop(), gameState.deck.pop()];
    player.status = 'playing';
  });

  gameState.players.forEach(player => {
    player.ws.send(JSON.stringify({
      type: 'newRound',
      currentRound: gameState.currentRound,
      maxRounds: gameState.maxRounds,
      moveTimeout: gameState.moveTimeout,
      dealerHand: [gameState.dealerHand[0], { value: 'Hidden', suit: '' }],
      players: gameState.players.map(p => ({ id: p.id, hand: p.hand, status: p.status, name: p.name, balance: p.balance }))
    }));
  });

  setTimeout(() => {
    gameState.players.forEach(player => {
      if (player.status === 'playing') {
        player.status = 'stand';
        gameState.players.forEach(p => {
          p.ws.send(JSON.stringify({ type: 'stand', playerId: player.id }));
        });
      }
    });
    checkRoundEnd(roomCode);
  }, gameState.moveTimeout * 1000);
}

function checkRoundEnd(roomCode) {
  const gameState = rooms[roomCode];
  if (gameState.players.every(p => p.status === 'stand' || p.status === 'bust')) {
    let dealerValue = calculateHandValue(gameState.dealerHand);
    while (dealerValue < 17) {
      gameState.dealerHand.push(gameState.deck.pop());
      dealerValue = calculateHandValue(gameState.dealerHand);
    }

    let winner = null;
    let maxValue = dealerValue > 21 ? -1 : dealerValue;
    let winnerId = 'dealer';
    gameState.players.forEach(player => {
      const playerValue = calculateHandValue(player.hand);
      if (playerValue <= 21 && playerValue > maxValue) {
        maxValue = playerValue;
        winner = player;
        winnerId = player.id;
      }
    });

    const totalPot = gameState.bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (winner) {
      winner.balance += totalPot;
    } else {
      gameState.dealerBalance += totalPot;
    }

    const results = gameState.players.map(player => {
      const playerValue = calculateHandValue(player.hand);
      if (playerValue > 21) {
        return { playerId: player.id, result: 'lose' };
      }
      if (playerValue === maxValue && maxValue <= 21) {
        return { playerId: player.id, result: 'win' };
      }
      return { playerId: player.id, result: 'lose' };
    });

    gameState.bets = [];
    gameState.players.forEach(player => {
      player.ws.send(JSON.stringify({
        type: 'roundEnd',
        dealerHand: gameState.dealerHand,
        results,
        scores: gameState.players.map(p => ({ id: p.id, balance: p.balance, name: p.name })),
        dealerBalance: gameState.dealerBalance,
        winnerId
      }));
    });

    if (gameState.currentRound < gameState.maxRounds) {
      setTimeout(() => {
        gameState.players.forEach(player => {
          player.status = 'waiting';
          player.ws.send(JSON.stringify({ type: 'promptBet', message: 'Place your bet for the next round (minimum R$10).' }));
        });
      }, 5000);
    } else {
      const scores = gameState.players.map(p => ({ id: p.id, balance: p.balance, name: p.name }));
      scores.push({ id: 'dealer', balance: gameState.dealerBalance, name: 'Dealer' });
      const winner = scores.reduce((a, b) => a.balance > b.balance ? a : b);
      gameState.players.forEach(player => {
        player.ws.send(JSON.stringify({
          type: 'gameEnd',
          winner: winner.id,
          winnerName: winner.name,
          scores
        }));
      });
      gameState.gameStarted = false;
      gameState.currentRound = 0;
      gameState.dealerBalance = 0;
      gameState.players.forEach(p => { p.balance = 50; p.status = 'waiting'; });
      setTimeout(() => {
        gameState.players.forEach(player => {
          player.ws.send(JSON.stringify({ type: 'promptName', message: 'Enter your name for a new game.' }));
        });
      }, 5000);
    }
  }
}

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});