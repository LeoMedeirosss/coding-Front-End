let ws;
let playerId;
let isHost = false;
let currentPlayers = [];

document.getElementById('joinRoom').addEventListener('click', () => {
  const roomCode = document.getElementById('roomCodeInput').value.trim().toUpperCase();
  if (roomCode.length !== 6) {
    document.getElementById('roomCodeError').style.display = 'block';
    document.getElementById('roomCodeError').textContent = 'Room code must be 6 characters';
    return;
  }

  ws = new WebSocket(`ws://${window.location.hostname}:8080?roomCode=${roomCode}`);

  ws.onopen = () => {
    document.getElementById('room-code-entry').style.display = 'none';
    document.getElementById('roomCodeError').style.display = 'none';
    document.getElementById('name-entry').style.display = 'block';
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'error') {
      document.getElementById('roomCodeError').style.display = 'block';
      document.getElementById('roomCodeError').textContent = data.message;
      ws.close();
      document.getElementById('room-code-entry').style.display = 'block';
      document.getElementById('name-entry').style.display = 'none';
      return;
    }

    if (data.type === 'playerId') {
      playerId = data.playerId;
      document.getElementById('status').textContent = `You are Player ${playerId}. Enter your name.`;
    }

    if (data.type === 'host') {
      isHost = true;
      document.getElementById('settings').style.display = 'block';
      document.getElementById('room-code-display').style.display = 'block';
      document.getElementById('roomCode').textContent = data.message.split(': ')[1];
      document.getElementById('status').textContent = data.message;
    }

    if (data.type === 'client') {
      document.getElementById('status').textContent = data.message;
    }

    if (data.type === 'promptName') {
      document.getElementById('name-entry').style.display = 'block';
      document.getElementById('status').textContent = data.message;
      if (isHost) {
        document.getElementById('settings').style.display = 'block';
      }
    }

    if (data.type === 'promptBet') {
      document.getElementById('bet-entry').style.display = 'block';
      document.getElementById('status').textContent = data.message;
    }

    if (data.type === 'updatePlayers') {
      currentPlayers = data.players;
      updateScoreboard(data.players);
      data.players.forEach(player => {
        document.getElementById(`player${player.id}`).style.display = 'block';
        document.getElementById(`player${player.id}`).querySelector('h2').textContent = `${player.name} (R$${player.balance})`;
      });
    }

    if (data.type === 'betPlaced') {
      document.getElementById('status').textContent = `Player ${data.playerId} bet R$${data.bet}`;
      currentPlayers = currentPlayers.map(p => p.id === data.playerId ? { ...p, balance: data.balance } : p);
      updateScoreboard(currentPlayers);
    }

    if (data.type === 'readyToStart') {
      document.getElementById('startGame').style.display = 'inline-block';
      document.getElementById('status').textContent = data.message;
    }

    if (data.type === 'settingsConfirmed') {
      document.getElementById('status').textContent = `Game settings: ${data.maxRounds} rounds, ${data.moveTimeout} seconds per move`;
    }

    if (data.type === 'newRound') {
      document.getElementById('name-entry').style.display = 'none';
      document.getElementById('bet-entry').style.display = 'none';
      if (isHost) {
        document.getElementById('settings').style.display = 'none';
      }
      document.getElementById('status').textContent = `Round ${data.currentRound} of ${data.maxRounds} | Move Timeout: ${data.moveTimeout}s`;
      renderHand('dealer-hand', data.dealerHand);
      data.players.forEach(player => {
        renderHand(`player${player.id}-hand`, player.hand);
        document.getElementById(`player${player.id}`).querySelector('h2').textContent = `${player.name} (R$${player.balance})`;
        if (player.id === playerId && player.status === 'playing') {
          document.getElementById(`player${playerId}-actions`).style.display = 'block';
        } else {
          document.getElementById(`player${player.id}-actions`).style.display = 'none';
        }
      });
      currentPlayers = data.players;
      updateScoreboard(data.players);
    }

    if (data.type === 'updateHand') {
      renderHand(`player${data.playerId}-hand`, data.hand);
    }

    if (data.type === 'bust') {
      document.getElementById('status').textContent = `${data.playerId === playerId ? 'You' : `Player ${data.playerId}`} busted!`;
      if (data.playerId === playerId) {
        document.getElementById(`player${playerId}-actions`).style.display = 'none';
      }
    }

    if (data.type === 'stand') {
      document.getElementById('status').textContent = `${data.playerId === playerId ? 'You' : `Player ${data.playerId}`} stands.`;
      if (data.playerId === playerId) {
        document.getElementById(`player${playerId}-actions`).style.display = 'none';
      }
    }

    if (data.type === 'roundEnd') {
      renderHand('dealer-hand', data.dealerHand);
      currentPlayers = data.scores;
      updateScoreboard(data.scores, data.dealerBalance);
      document.getElementById('status').textContent = `Round ended. ${data.winnerId === 'dealer' ? 'Dealer' : `Player ${data.winnerId}`} wins!`;
      for (let i = 1; i <= 4; i++) {
        document.getElementById(`player${i}-actions`).style.display = 'none';
      }
    }

    if (data.type === 'gameEnd') {
      updateScoreboard(data.scores);
      document.getElementById('status').textContent = `Game Over! ${data.winnerName} wins with R$${data.scores.find(s => s.id === data.winner).balance}!`;
      for (let i = 1; i <= 4; i++) {
        document.getElementById(`player${i}-actions`).style.display = 'none';
      }
      if (isHost) {
        document.getElementById('settings').style.display = 'block';
      }
    }

    if (data.type === 'playerLeft') {
      document.getElementById('status').textContent = data.message;
      for (let i = 1; i <= 4; i++) {
        document.getElementById(`player${i}-actions`).style.display = 'none';
      }
      currentPlayers = currentPlayers.filter(p => p.id !== data.playerId);
      updateScoreboard(currentPlayers);
    }
  };

  ws.onclose = () => {
    document.getElementById('status').textContent = 'Disconnected from server';
    document.getElementById('room-code-entry').style.display = 'block';
    document.getElementById('name-entry').style.display = 'none';
    document.getElementById('bet-entry').style.display = 'none';
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`player${i}-actions`).style.display = 'none';
    }
  };
});

document.getElementById('submitName').addEventListener('click', () => {
  const name = document.getElementById('playerName').value.trim();
  if (name) {
    ws.send(JSON.stringify({ type: 'setName', playerId, name }));
    document.getElementById('name-entry').style.display = 'none';
    document.getElementById('status').textContent = `Waiting for other players...`;
  }
});

document.getElementById('submitBet').addEventListener('click', () => {
  const bet = parseInt(document.getElementById('betAmount').value);
  if (isNaN(bet) || bet < 10) {
    document.getElementById('betError').style.display = 'block';
    document.getElementById('betError').textContent = 'Bet must be at least R$10';
    return;
  }
  ws.send(JSON.stringify({ type: 'placeBet', playerId, bet }));
  document.getElementById('bet-entry').style.display = 'none';
  document.getElementById('betError').style.display = 'none';
});

document.getElementById('submitSettings').addEventListener('click', () => {
  const maxRounds = document.getElementById('maxRounds').value;
  const moveTimeout = document.getElementById('moveTimeout').value;
  ws.send(JSON.stringify({ type: 'settings', maxRounds, moveTimeout }));
});

document.getElementById('startGame').addEventListener('click', () => {
  ws.send(JSON.stringify({ type: 'startGame' }));
  if (isHost) {
    document.getElementById('settings').style.display = 'none';
  }
});

for (let i = 1; i <= 4; i++) {
  document.getElementById(`hit${i}`).addEventListener('click', () => {
    ws.send(JSON.stringify({ type: 'hit', playerId }));
  });
  document.getElementById(`stand${i}`).addEventListener('click', () => {
    ws.send(JSON.stringify({ type: 'stand', playerId }));
  });
}

function renderHand(elementId, hand) {
  const handElement = document.getElementById(elementId);
  handElement.innerHTML = '';
  hand.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''} ${card.value === 'Hidden' ? 'hidden' : ''}`;
    cardElement.setAttribute('data-suit', card.suit);
    cardElement.textContent = card.value === 'Hidden' ? '' : card.value;
    handElement.appendChild(cardElement);
  });
}

function updateScoreboard(players, dealerBalance = 0) {
  const scoresElement = document.getElementById('scores');
  scoresElement.innerHTML = '';
  players.forEach(player => {
    const scoreElement = document.createElement('div');
    scoreElement.className = 'score';
    scoreElement.textContent = `${player.name}: R$${player.balance}`;
    scoresElement.appendChild(scoreElement);
  });
  const dealerScoreElement = document.createElement('div');
  dealerScoreElement.className = 'score';
  dealerScoreElement.textContent = `Banca: R$${dealerBalance}`;
  scoresElement.appendChild(dealerScoreElement);
}
