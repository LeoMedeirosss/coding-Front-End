const setupForm = document.getElementById("setupForm");
const gameArea = document.getElementById("gameArea");
const dealerCards = document.getElementById("dealerCards");
const dealerTotal = document.getElementById("dealerTotal");
const playersArea = document.getElementById("playersArea");
const scoreBoard = document.getElementById("scoreBoard");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");
const namesContainer = document.getElementById("namesContainer");

let players = [], dealer = {}, deck = [], currentPlayer = 0, timeout = 0;
let scores = {};

setupForm.players.addEventListener("change", () => {
  namesContainer.innerHTML = "";
  for (let i = 0; i < parseInt(setupForm.players.value); i++) {
    namesContainer.innerHTML += `
      <label>Nome do jogador ${i + 1}</label>
      <input type="text" name="playerName${i}" required/>
    `;
  }
});

setupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    timeout = parseInt(setupForm.timeout.value) * 1000;
    players = [];
  
    const nameInputs = namesContainer.querySelectorAll("input");
    nameInputs.forEach((input) => {
      const name = input.value.trim();
      if (name.length > 0) {
        players.push({ name, hand: [], stopped: false });
        if (!(name in scores)) scores[name] = 0;
      }
    });
  
    dealer = { name: "Banca", hand: [] };
    if (!("Banca" in scores)) scores["Banca"] = 0;
  
    setupForm.classList.add("hidden");
    gameArea.classList.remove("hidden");
    startGame();
  });

function createDeck() {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let newDeck = [];

  for (let suit of suits) {
    for (let val of values) {
      newDeck.push({ suit, value: val });
    }
  }

  return newDeck.sort(() => 0.5 - Math.random());
}

function drawCard() {
  return deck.pop();
}

function handValue(hand) {
  let total = 0, aces = 0;
  for (let card of hand) {
    if (["J", "Q", "K"].includes(card.value)) total += 10;
    else if (card.value === "A") {
      total += 11;
      aces++;
    } else total += parseInt(card.value);
  }
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}

function renderHand(container, hand) {
  container.innerHTML = "";
  hand.forEach(card => {
    const el = document.createElement("div");
    el.className = "card";
    el.textContent = `${card.value}${card.suit}`;
    container.appendChild(el);
  });
}

function renderGame() {
  dealerTotal.textContent = "Total: " + handValue(dealer.hand);
  renderHand(dealerCards, dealer.hand);

  playersArea.innerHTML = "";
  players.forEach((player, index) => {
    const div = document.createElement("div");
    div.className = "cardArea";
    div.innerHTML = `<h2>${player.name}</h2><div class="cards" id="player${index}Cards"></div><p>Total: ${handValue(player.hand)}</p>`;
    playersArea.appendChild(div);
    renderHand(div.querySelector(`#player${index}Cards`), player.hand);
  });

  updateScoreboard();
}

function updateScoreboard() {
  scoreBoard.innerHTML = "<h3>Placar</h3>";
  for (let name in scores) {
    scoreBoard.innerHTML += `<p>${name}: ${scores[name]}</p>`;
  }
}

function startGame() {
  deck = createDeck();
  dealer.hand = [drawCard(), drawCard()];
  players.forEach(player => {
    player.hand = [drawCard(), drawCard()];
    player.stopped = false;
  });

  currentPlayer = 0;
  renderGame();
  nextTurn();
}

function nextTurn() {
  if (currentPlayer >= players.length) {
    dealerTurn();
    return;
  }

  const player = players[currentPlayer];
  if (player.stopped) {
    currentPlayer++;
    nextTurn();
    return;
  }

  hitBtn.disabled = false;
  standBtn.disabled = false;

  const timer = setTimeout(() => {
    player.stopped = true;
    currentPlayer++;
    nextTurn();
  }, timeout);

  hitBtn.onclick = () => {
    clearTimeout(timer);
    player.hand.push(drawCard());
    if (handValue(player.hand) > 21) player.stopped = true;
    renderGame();
  };

  standBtn.onclick = () => {
    clearTimeout(timer);
    player.stopped = true;
    currentPlayer++;
    nextTurn();
  };
}

function dealerTurn() {
  while (handValue(dealer.hand) < 17) {
    dealer.hand.push(drawCard());
  }

  const dealerVal = handValue(dealer.hand);
  players.forEach(player => {
    const playerVal = handValue(player.hand);
    if ((playerVal <= 21 && playerVal > dealerVal) || (playerVal <= 21 && dealerVal > 21)) {
      scores[player.name] += 10;
    } else {
      scores["Banca"] += 10;
    }
  });

  renderGame();
  setTimeout(() => {
    alert("Nova rodada!");
    startGame();
  }, 3000);
}
