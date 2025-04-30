const imagens = [
    "🍎", "🚗", "🐶", "⚽", "🎵", "🧠", "🎲", "🚀",
    "🌈", "📱", "🎮", "👓", "📚", "🍕", "🐱", "🏀"
  ];
  
  let jogadores = [];
  let pontuacoes = [];
  let jogadorAtual = 0;
  let totalPares;
  let paresEncontrados = 0;
  let primeiraCarta = null;
  let travado = false;
  
  function gerarInputsNomes() {
    const num = parseInt(document.getElementById("numJogadores").value);
    if (isNaN(num) || num < 2 || num > 6) {
      alert("Número de jogadores inválido.");
      return;
    }
    const container = document.getElementById("nomesJogadores");
    container.innerHTML = "";
    for (let i = 0; i < num; i++) {
      container.innerHTML += `<input type="text" placeholder="Nome do jogador ${i + 1}" id="jogador${i}"><br>`;
    }
  }
  
  function iniciarJogo() {
    const numJogadores = parseInt(document.getElementById("numJogadores").value);
    const numPecas = parseInt(document.getElementById("numPecas").value);
  
    if (isNaN(numJogadores) || numJogadores < 2 || numJogadores > 6) {
      alert("Número de jogadores inválido.");
      return;
    }
    if (isNaN(numPecas) || numPecas < 8 || numPecas > 32 || numPecas % 2 !== 0) {
      alert("Quantidade de peças inválida.");
      return;
    }
  
    jogadores = [];
    pontuacoes = Array(numJogadores).fill(0);
    for (let i = 0; i < numJogadores; i++) {
      const nome = document.getElementById(`jogador${i}`).value.trim() || `Jogador ${i + 1}`;
      jogadores.push(nome);
    }
  
    jogadorAtual = 0;
    paresEncontrados = 0;
    totalPares = numPecas / 2;
    criarTabuleiro(numPecas);
  
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("tabuleiro").classList.remove("hidden");
    document.getElementById("pontuacao").classList.remove("hidden");
    document.getElementById("turno").classList.remove("hidden");
  
    atualizarPontuacao();
  }
  
  function criarTabuleiro(numPecas) {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
    const numColunas = Math.ceil(Math.sqrt(numPecas));
    tabuleiro.style.gridTemplateColumns = `repeat(${numColunas}, 1fr)`;
  
    const selecionadas = imagens.slice(0, numPecas / 2);
    const cartas = [...selecionadas, ...selecionadas];
    cartas.sort(() => Math.random() - 0.5);
  
    cartas.forEach(simbolo => {
      const carta = document.createElement("div");
      carta.className = "card";
      carta.dataset.simbolo = simbolo;
      const conteudo = document.createElement("div");
      conteudo.textContent = simbolo;
      carta.appendChild(conteudo);
      carta.addEventListener("click", () => virarCarta(carta));
      tabuleiro.appendChild(carta);
    });
  }
  
  function virarCarta(carta) {
    if (travado || carta.classList.contains("revealed")) return;
  
    carta.classList.add("revealed");
  
    if (!primeiraCarta) {
      primeiraCarta = carta;
    } else {
      const segundaCarta = carta;
      if (primeiraCarta.dataset.simbolo === segundaCarta.dataset.simbolo) {
        pontuacoes[jogadorAtual]++;
        paresEncontrados++;
        primeiraCarta = null;
        atualizarPontuacao();
        checarFimDoJogo();
      } else {
        travado = true;
        setTimeout(() => {
          primeiraCarta.classList.remove("revealed");
          segundaCarta.classList.remove("revealed");
          primeiraCarta = null;
          travado = false;
          jogadorAtual = (jogadorAtual + 1) % jogadores.length;
          atualizarPontuacao();
        }, 1000);
      }
    }
  }
  
  function atualizarPontuacao() {
    const div = document.getElementById("pontuacao");
    div.innerHTML = jogadores.map((nome, i) => `${nome}: ${pontuacoes[i]} ponto(s)`).join("<br>");
    document.getElementById("turno").innerText = `Vez de: ${jogadores[jogadorAtual]}`;
  }
  
  function checarFimDoJogo() {
    if (paresEncontrados === totalPares) {
      const max = Math.max(...pontuacoes);
      const vencedores = jogadores.filter((_, i) => pontuacoes[i] === max);
      const resultado = vencedores.length > 1
        ? `Empate entre: ${vencedores.join(" e ")} com ${max} ponto(s)!`
        : `Vencedor: ${vencedores[0]} com ${max} ponto(s)!`;
  
      document.getElementById("vitoria").classList.remove("hidden");
      document.getElementById("resultadoFinal").innerHTML = resultado;
      document.getElementById("tabuleiro").classList.add("hidden");
      document.getElementById("pontuacao").classList.add("hidden");
      document.getElementById("turno").classList.add("hidden");
    }
  }
  
  function reiniciar() {
    document.getElementById("setup").classList.remove("hidden");
    document.getElementById("vitoria").classList.add("hidden");
    document.getElementById("tabuleiro").innerHTML = "";
    document.getElementById("nomesJogadores").innerHTML = "";
    document.getElementById("numJogadores").value = "";
    document.getElementById("numPecas").value = "";
  }
  