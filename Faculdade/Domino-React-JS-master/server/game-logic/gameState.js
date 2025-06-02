import { gerarPedras, embaralhar, distribuirPedras } from './domino.js';

class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.jogadores = []; // { id, nome, socketId, pedras, dupla }
    this.duplas = [[], []]; // Array de arrays de nomes
    this.vez = null; // índice do jogador da vez
    this.mesa = []; // pedras jogadas na mesa
    this.dorme = [];
    this.placar = [0, 0];
    this.rodada = 0;
    this.pontosRodada = 1;
    this.estado = 'esperando'; // esperando, jogando, rodada_fim, fim
    this.historico = [];
    this.empatesSeguidos = 0;
  }

  salaCheia() {
    return this.jogadores.length >= 4;
  }

  nomeDuplicado(nome) {
    return this.jogadores.some(j => j.nome === nome);
  }

  adicionarJogador({ nome, socketId }) {
    if (this.salaCheia() || this.nomeDuplicado(nome)) return false;
    this.jogadores.push({ id: this.jogadores.length, nome, socketId, pedras: [], dupla: null });
    return true;
  }

  removerJogador(socketId) {
    this.jogadores = this.jogadores.filter(j => j.socketId !== socketId);
    if (this.jogadores.length < 4) this.estado = 'esperando';
  }

  sortearDuplas() {
    const indices = [0, 1, 2, 3];
    embaralhar(indices);
    this.duplas = [
      [this.jogadores[indices[0]].nome, this.jogadores[indices[2]].nome],
      [this.jogadores[indices[1]].nome, this.jogadores[indices[3]].nome]
    ];
    this.jogadores[indices[0]].dupla = 0;
    this.jogadores[indices[2]].dupla = 0;
    this.jogadores[indices[1]].dupla = 1;
    this.jogadores[indices[3]].dupla = 1;
  }

  definirPrimeiroJogador() {
    // Regra: primeira rodada ou após empate, começa quem tem a maior carroça
    let maiorCarroca = -1;
    let jogadorComMaiorCarroca = null;
    this.jogadores.forEach((j, idx) => {
      for (const pedra of j.pedras) {
        if (pedra[0] === pedra[1] && pedra[0] > maiorCarroca) {
          maiorCarroca = pedra[0];
          jogadorComMaiorCarroca = idx;
        }
      }
    });
    this.vez = jogadorComMaiorCarroca !== null ? jogadorComMaiorCarroca : 0;
  }

  iniciarRodada() {
    const pedras = embaralhar(gerarPedras());
    const { jogadores, dorme } = distribuirPedras(pedras);
    this.jogadores.forEach((j, idx) => {
      j.pedras = jogadores[idx];
    });
    this.dorme = dorme;
    this.mesa = [];
    this.rodada++;
    this.estado = 'jogando';
    this.definirPrimeiroJogador();
  }
}

export const gameState = new GameState(); 