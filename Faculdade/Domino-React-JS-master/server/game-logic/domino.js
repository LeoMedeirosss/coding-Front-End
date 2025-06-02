// Gera todas as 28 pedras do dominó clássico
export function gerarPedras() {
  const pedras = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      pedras.push([i, j]);
    }
  }
  return pedras;
}

// Embaralha um array (Fisher-Yates)
export function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Distribui as pedras para 4 jogadores e retorna também o dorme
export function distribuirPedras(pedras) {
  const jogadores = [[], [], [], []];
  for (let i = 0; i < 4; i++) {
    jogadores[i] = pedras.slice(i * 6, (i + 1) * 6);
  }
  const dorme = pedras.slice(24);
  return { jogadores, dorme };
}

// Verifica se a pedra pode ser jogada na posição indicada
export function validaJogada(mesa, pedra, pos) {
  if (mesa.length === 0) return true;
  const esquerda = mesa[0][0];
  const direita = mesa[mesa.length - 1][1];
  if (pos === 'esquerda') {
    return pedra[0] === esquerda || pedra[1] === esquerda;
  } else if (pos === 'direita') {
    return pedra[0] === direita || pedra[1] === direita;
  }
  return false;
}

// Retorna a pedra na orientação correta para encaixar na mesa
export function orientarPedra(mesa, pedra, pos) {
  if (mesa.length === 0) return pedra;
  const esquerda = mesa[0][0];
  const direita = mesa[mesa.length - 1][1];
  if (pos === 'esquerda') {
    if (pedra[1] === esquerda) return pedra;
    if (pedra[0] === esquerda) return [pedra[1], pedra[0]];
  } else if (pos === 'direita') {
    if (pedra[0] === direita) return pedra;
    if (pedra[1] === direita) return [pedra[1], pedra[0]];
  }
  return pedra;
} 