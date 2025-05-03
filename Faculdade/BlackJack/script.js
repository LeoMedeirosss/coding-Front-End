document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const setupScreen = document.getElementById('setup-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    
    const playerCountInput = document.getElementById('player-count');
    const playerNamesDiv = document.getElementById('player-names');
    const startGameBtn = document.getElementById('start-game');
    const roundsInput = document.getElementById('rounds');
    const timeoutInput = document.getElementById('timeout');
    
    const roundInfo = document.getElementById('round-info');
    const turnInfo = document.getElementById('turn-info');
    const timer = document.getElementById('timer');
    const dealerHand = document.getElementById('dealer-hand');
    const dealerScore = document.getElementById('dealer-score');
    const playersContainer = document.getElementById('players-container');
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const scoreTable = document.querySelector('#score-table tbody');
    
    const roundResult = document.getElementById('round-result');
    const nextRoundBtn = document.getElementById('next-round-btn');
    const finalResults = document.getElementById('final-results');
    const newGameBtn = document.getElementById('new-game-btn');
    
    // Variáveis do jogo
    let gameState = {
        players: [],
        dealer: { name: "Banca", hand: [], score: 0, totalPoints: 0 },
        deck: [],
        currentPlayerIndex: 0,
        currentRound: 1,
        totalRounds: 3,
        timeout: 30,
        timerInterval: null,
        timeLeft: 30
    };
    
    // Inicializa o jogo
    function initGame() {
        // Configuração dos jogadores
        const playerCount = parseInt(playerCountInput.value);
        gameState.totalRounds = parseInt(roundsInput.value);
        gameState.timeout = parseInt(timeoutInput.value);
        gameState.timeLeft = gameState.timeout;
        gameState.currentRound = 1;
        gameState.currentPlayerIndex = 0;
        
        // Limpa jogadores anteriores
        gameState.players = [];
        gameState.dealer = { name: "Banca", hand: [], score: 0, totalPoints: 0 };
        
        // Cria os jogadores
        for (let i = 0; i < playerCount; i++) {
            const nameInput = document.getElementById(`player-${i}-name`);
            if (nameInput && nameInput.value.trim()) {
                gameState.players.push({
                    name: nameInput.value.trim(),
                    hand: [],
                    score: 0,
                    totalPoints: 0,
                    element: null,
                    scoreElement: null
                });
            }
        }
        
        // Verifica se temos jogadores suficientes
        if (gameState.players.length < 2) {
            alert('É necessário pelo menos 2 jogadores para começar o jogo!');
            return;
        }
        
        // Inicia o jogo
        startRound();
    }
    
    // Gera um baralho novo
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
    
    // Inicia uma nova rodada
    function startRound() {
        // Reseta o estado da rodada
        gameState.deck = generateDeck();
        gameState.dealer.hand = [];
        gameState.dealer.score = 0;
        gameState.currentPlayerIndex = 0;
        gameState.timeLeft = gameState.timeout;
        
        // Limpa as mãos dos jogadores
        for (let player of gameState.players) {
            player.hand = [];
            player.score = 0;
        }
        
        // Distribui as cartas iniciais
        dealInitialCards();
        
        // Atualiza a UI
        updateGameUI();
        
        // Mostra a tela de jogo
        setupScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        
        // Inicia o timer
        startTimer();
    }
    
    // Distribui as cartas iniciais
    function dealInitialCards() {
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
        gameState.dealer.score = calculateScore([gameState.dealer.hand[0]]); // Mostra apenas a primeira carta do dealer
    }
    
    // Compra uma carta do baralho
    function drawCard() {
        if (gameState.deck.length === 0) {
            gameState.deck = generateDeck(); // Recria o baralho se estiver vazio
        }
        return gameState.deck.pop();
    }
    
    // Calcula o score de uma mão
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
    
    // Atualiza a interface do jogo
    function updateGameUI() {
        // Atualiza informações da rodada
        roundInfo.textContent = `Rodada ${gameState.currentRound} de ${gameState.totalRounds}`;
        
        // Verifica se ainda há jogadores para jogar
        if (gameState.currentPlayerIndex < gameState.players.length) {
            turnInfo.textContent = `Vez de: ${gameState.players[gameState.currentPlayerIndex].name}`;
        } else {
            turnInfo.textContent = `Vez da Banca`;
        }
        
        timer.textContent = `Tempo: ${gameState.timeLeft}s`;
        
        // Atualiza a mão do dealer
        dealerHand.innerHTML = '';
        gameState.dealer.hand.forEach((card, index) => {
            // Na vez dos jogadores, mostra apenas a primeira carta do dealer
            if (index === 0 || gameState.currentPlayerIndex >= gameState.players.length) {
                const cardElement = createCardElement(card);
                dealerHand.appendChild(cardElement);
            } else {
                // Carta virada para baixo
                const cardBack = document.createElement('div');
                cardBack.className = 'card';
                cardBack.style.backgroundColor = '#333';
                dealerHand.appendChild(cardBack);
            }
        });
        
        // Atualiza o score do dealer
        if (gameState.currentPlayerIndex >= gameState.players.length) {
            // Mostra o score real se for a vez do dealer
            dealerScore.textContent = `Pontos: ${gameState.dealer.score}`;
        } else {
            // Mostra apenas a primeira carta se for a vez dos jogadores
            dealerScore.textContent = `Pontos: ${calculateScore([gameState.dealer.hand[0]])}`;
        }
        
        // Atualiza as mãos dos jogadores
        playersContainer.innerHTML = '';
        
        for (let i = 0; i < gameState.players.length; i++) {
            const player = gameState.players[i];
            const playerActive = i === gameState.currentPlayerIndex;
            
            const playerArea = document.createElement('div');
            playerArea.className = `player-area ${playerActive ? 'active' : ''}`;
            playerArea.id = `player-${i}-area`;
            
            const playerName = document.createElement('h3');
            playerName.textContent = player.name;
            playerArea.appendChild(playerName);
            
            const handDiv = document.createElement('div');
            handDiv.className = 'hand';
            player.hand.forEach(card => {
                handDiv.appendChild(createCardElement(card));
            });
            playerArea.appendChild(handDiv);
            
            const scoreDiv = document.createElement('div');
            scoreDiv.className = 'score';
            scoreDiv.textContent = `Pontos: ${player.score}`;
            playerArea.appendChild(scoreDiv);
            
            if (player.score === 21 && player.hand.length === 2) {
                const blackjackDiv = document.createElement('div');
                blackjackDiv.className = 'blackjack';
                blackjackDiv.textContent = 'BLACKJACK!';
                playerArea.appendChild(blackjackDiv);
            } else if (player.score > 21) {
                const bustedDiv = document.createElement('div');
                bustedDiv.className = 'busted';
                bustedDiv.textContent = 'ESTOROU!';
                playerArea.appendChild(bustedDiv);
            }
            
            playersContainer.appendChild(playerArea);
            player.element = playerArea;
            player.scoreElement = scoreDiv;
        }
        
        // Atualiza o placar
        updateScoreboard();
        
        // Mostra/oculta controles dependendo de quem está jogando
        if (gameState.currentPlayerIndex < gameState.players.length) {
            hitBtn.style.display = 'inline-block';
            standBtn.style.display = 'inline-block';
        } else {
            hitBtn.style.display = 'none';
            standBtn.style.display = 'none';
        }
    }
    
    // Cria um elemento de carta
    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}`;
        
        const valueTop = document.createElement('div');
        valueTop.className = 'card-value top';
        valueTop.textContent = card.value;
        cardElement.appendChild(valueTop);
        
        const suit = document.createElement('div');
        suit.className = 'card-suit';
        suit.textContent = card.suit;
        cardElement.appendChild(suit);
        
        const valueBottom = document.createElement('div');
        valueBottom.className = 'card-value bottom';
        valueBottom.textContent = card.value;
        cardElement.appendChild(valueBottom);
        
        return cardElement;
    }
    
    // Atualiza o placar
    function updateScoreboard() {
        scoreTable.innerHTML = '';
        
        // Adiciona os jogadores
        for (let player of gameState.players) {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = player.name;
            row.appendChild(nameCell);
            
            const pointsCell = document.createElement('td');
            pointsCell.textContent = player.totalPoints;
            row.appendChild(pointsCell);
            
            scoreTable.appendChild(row);
        }
        
        // Adiciona o dealer
        const dealerRow = document.createElement('tr');
        
        const dealerNameCell = document.createElement('td');
        dealerNameCell.textContent = gameState.dealer.name;
        dealerRow.appendChild(dealerNameCell);
        
        const dealerPointsCell = document.createElement('td');
        dealerPointsCell.textContent = gameState.dealer.totalPoints;
        dealerRow.appendChild(dealerPointsCell);
        
        scoreTable.appendChild(dealerRow);
    }
    
    // Inicia o timer
    function startTimer() {
        clearInterval(gameState.timerInterval);
        gameState.timeLeft = gameState.timeout;
        timer.textContent = `Tempo: ${gameState.timeLeft}s`;
        
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft--;
            timer.textContent = `Tempo: ${gameState.timeLeft}s`;
            
            if (gameState.timeLeft <= 0) {
                clearInterval(gameState.timerInterval);
                timeOut();
            }
        }, 1000);
    }
    
    // Tempo esgotado
    function timeOut() {
        if (gameState.currentPlayerIndex < gameState.players.length) {
            // Jogador atual perdeu o tempo, passa para o próximo
            stand();
        }
    }
    
    // Ação de pedir carta
    function hit() {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        currentPlayer.hand.push(drawCard());
        currentPlayer.score = calculateScore(currentPlayer.hand);
        
        // Verifica se estourou
        if (currentPlayer.score > 21) {
            stand();
        } else {
            updateGameUI();
            resetTimer();
        }
    }
    
    // Ação de parar
    function stand() {
        // Passa para o próximo jogador
        gameState.currentPlayerIndex++;
        
        if (gameState.currentPlayerIndex < gameState.players.length) {
            // Ainda há jogadores para jogar
            resetTimer();
            updateGameUI();
        } else {
            // Todos os jogadores já jogaram, vez do dealer
            playDealer();
        }
    }
    
    // Lógica do dealer
    function playDealer() {
        clearInterval(gameState.timerInterval);
        
        // Mostra todas as cartas do dealer
        gameState.dealer.score = calculateScore(gameState.dealer.hand);
        updateGameUI();
        
        // O dealer deve comprar cartas até ter 17 ou mais pontos
        const dealerPlayInterval = setInterval(() => {
            if (gameState.dealer.score < 17) {
                gameState.dealer.hand.push(drawCard());
                gameState.dealer.score = calculateScore(gameState.dealer.hand);
                updateGameUI();
            } else {
                clearInterval(dealerPlayInterval);
                setTimeout(endRound, 1500);
            }
        }, 1000);
    }
    
    // Finaliza a rodada
    function endRound() {
        clearInterval(gameState.timerInterval);
        
        // Determina os vencedores
        const dealerScore = gameState.dealer.score;
        const winners = [];
        let dealerWins = true;
        
        for (let player of gameState.players) {
            if (player.score <= 21) {
                if (dealerScore > 21 || player.score > dealerScore) {
                    player.totalPoints += 10;
                    winners.push(player.name);
                    dealerWins = false;
                }
            }
        }
        
        // O dealer ganha pontos se não houver vencedores entre os jogadores
        if (dealerWins && dealerScore <= 21) {
            gameState.dealer.totalPoints += 10;
        }
        
        // Mostra o resultado
        showRoundResult(winners, dealerWins);
    }
    
    // Mostra o resultado da rodada
    function showRoundResult(winners, dealerWins) {
        gameScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        let resultHTML = '';
        
        if (winners.length > 0) {
            resultHTML += `<p>Vencedores: ${winners.join(', ')}</p>`;
            resultHTML += `<p>Pontos ganhos: 10 para cada vencedor</p>`;
        }
        
        if (dealerWins) {
            resultHTML += `<p>A banca venceu esta rodada!</p>`;
            resultHTML += `<p>Pontos ganhos: 10 para a banca</p>`;
        }
        
        roundResult.innerHTML = resultHTML;
        
        // Verifica se é o fim do jogo
        if (gameState.currentRound >= gameState.totalRounds) {
            nextRoundBtn.textContent = 'Ver Resultado Final';
        } else {
            nextRoundBtn.textContent = 'Próxima Rodada';
        }
    }
    
    // Mostra o resultado final
    function showFinalResults() {
        resultScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        
        // Ordena os jogadores por pontos (incluindo o dealer)
        const allPlayers = [...gameState.players, gameState.dealer];
        allPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
        
        let resultsHTML = '<h2>Pontuação Final</h2><ol>';
        
        for (let player of allPlayers) {
            resultsHTML += `<li>${player.name}: ${player.totalPoints} pontos</li>`;
        }
        
        resultsHTML += '</ol>';
        
        // Verifica se há empate
        if (allPlayers.length > 1 && allPlayers[0].totalPoints === allPlayers[1].totalPoints) {
            resultsHTML += '<p>Empate!</p>';
        } else {
            resultsHTML += `<p>Vencedor: ${allPlayers[0].name} com ${allPlayers[0].totalPoints} pontos!</p>`;
        }
        
        finalResults.innerHTML = resultsHTML;
    }
    
    // Reseta o timer
    function resetTimer() {
        gameState.timeLeft = gameState.timeout;
        clearInterval(gameState.timerInterval);
        startTimer();
    }
    
    // Event Listeners
    
    // Atualiza os campos de nome dos jogadores quando o número de jogadores muda
    playerCountInput.addEventListener('change', () => {
        const count = parseInt(playerCountInput.value);
        playerNamesDiv.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = `Nome do Jogador ${i + 1}:`;
            div.appendChild(label);
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `player-${i}-name`;
            input.required = true;
            div.appendChild(input);
            
            playerNamesDiv.appendChild(div);
        }
    });
    
    // Inicia o jogo
    startGameBtn.addEventListener('click', () => {
        // Validação
        const playerCount = parseInt(playerCountInput.value);
        let valid = true;
        
        for (let i = 0; i < playerCount; i++) {
            const nameInput = document.getElementById(`player-${i}-name`);
            if (!nameInput || !nameInput.value.trim()) {
                alert(`Por favor, insira o nome do Jogador ${i + 1}`);
                valid = false;
                break;
            }
        }
        
        if (valid) {
            initGame();
        }
    });
    
    // Controles do jogo
    hitBtn.addEventListener('click', hit);
    standBtn.addEventListener('click', stand);
    
    // Próxima rodada ou fim do jogo
    nextRoundBtn.addEventListener('click', () => {
        if (gameState.currentRound >= gameState.totalRounds) {
            showFinalResults();
        } else {
            gameState.currentRound++;
            startRound();
        }
    });
    
    // Novo jogo
    newGameBtn.addEventListener('click', () => {
        gameOverScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
    });
    
    // Dispara o evento change para criar os campos de nome inicialmente
    playerCountInput.dispatchEvent(new Event('change'));
});