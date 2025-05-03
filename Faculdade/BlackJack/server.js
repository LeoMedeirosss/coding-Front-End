const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Estado do jogo
const gameState = {
    players: [],
    dealer: { name: "Banca", hand: [], score: 0, totalPoints: 0 },
    deck: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    totalRounds: 3,
    status: 'waiting' // waiting, playing, dealer-turn, round-end, game-over
};

// server.js

function generateDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    
    // Embaralha o baralho
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    
    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
    
    // Ajusta os Ases se necessário
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    
    return score;
}

function dealInitialCards() {
    // Gera novo baralho se necessário
    if (gameState.deck.length < 10) { // Limite arbitrário para recriar o baralho
        gameState.deck = generateDeck();
    }
    
    // Limpa as mãos atuais
    gameState.dealer.hand = [];
    gameState.dealer.score = 0;
    gameState.players.forEach(player => {
        player.hand = [];
        player.score = 0;
    });
    
    // Distribui 2 cartas para cada jogador
    for (let i = 0; i < 2; i++) {
        for (let player of gameState.players) {
            player.hand.push(drawCard());
        }
        gameState.dealer.hand.push(drawCard());
    }
    
    // Calcula os scores iniciais
    for (let player of gameState.players) {
        player.score = calculateScore(player.hand);
    }
    gameState.dealer.score = calculateScore([gameState.dealer.hand[0]]); // Mostra apenas a primeira carta
}

function drawCard() {
    if (gameState.deck.length === 0) {
        gameState.deck = generateDeck(); // Recria o baralho se estiver vazio
    }
    return gameState.deck.pop();
}

wss.on('connection', ws => {
    console.log('Novo cliente conectado');
    
    // Enviar estado atual quando um cliente se conecta
    ws.send(JSON.stringify({
        type: 'game-state',
        data: gameState
    }));
    
    ws.on('message', message => {
        const data = JSON.parse(message);
        
        if (data.type === 'join') {
            // Novo jogador querendo entrar
            if (gameState.status === 'waiting') {
                gameState.players.push({
                    id: data.playerId,
                    name: data.name,
                    hand: [],
                    score: 0,
                    totalPoints: 0,
                    ready: false
                });
                
                if (gameState.players.length >= 2) {
                    gameState.status = 'ready';
                }
            }
        }
        
        if (data.type === 'action') {
            // Processar ação do jogador
            if (data.action === 'hit') {
                // Lógica para pedir carta
            } else if (data.action === 'stand') {
                // Lógica para parar
            }
        }
        
        // Enviar atualização para todos
        broadcast(JSON.stringify({
            type: 'game-state',
            data: gameState
        }));
    });
});

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

console.log('Servidor WebSocket rodando na porta 8080');