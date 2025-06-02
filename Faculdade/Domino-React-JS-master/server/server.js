import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { gameState } from './game-logic/gameState.js';
import { validaJogada, orientarPedra } from './game-logic/domino.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Adicionar controle de toques consecutivos
let toquesSeguidos = 0;

// --- Lógica do jogo será implementada aqui ---

io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  socket.on('entrar', ({ nome }, callback) => {
    if (gameState.salaCheia()) {
      callback({ ok: false, motivo: 'Sala cheia' });
      return;
    }
    if (gameState.nomeDuplicado(nome)) {
      callback({ ok: false, motivo: 'Nome duplicado' });
      return;
    }
    gameState.adicionarJogador({ nome, socketId: socket.id });
    callback({ ok: true });
    if (gameState.salaCheia()) {
      gameState.sortearDuplas();
      gameState.iniciarRodada();
      syncStateToAll();
    } else {
      // Só envia o estado público, sem pedras detalhadas
      io.emit('estado', getPublicGameState());
    }
  });

  socket.on('disconnect', () => {
    gameState.removerJogador(socket.id);
    syncStateToAll();
    console.log('Cliente desconectado:', socket.id);
  });

  socket.on('jogar', ({ pedra, pos }, callback) => {
    const jogadorIdx = gameState.jogadores.findIndex(j => j.socketId === socket.id);
    if (gameState.vez !== jogadorIdx || gameState.estado !== 'jogando') {
      callback && callback({ ok: false, motivo: 'Não é sua vez' });
      return;
    }
    // Validar se a pedra está na mão do jogador
    const idxPedra = gameState.jogadores[jogadorIdx].pedras.findIndex(p => p[0] === pedra[0] && p[1] === pedra[1]);
    if (idxPedra === -1) {
      callback && callback({ ok: false, motivo: 'Pedra não está na sua mão' });
      return;
    }
    // Validar se encaixa na mesa
    if (!validaJogada(gameState.mesa, pedra, pos)) {
      callback && callback({ ok: false, motivo: 'Jogada inválida' });
      return;
    }
    // Remover pedra da mão
    const pedraJogada = gameState.jogadores[jogadorIdx].pedras.splice(idxPedra, 1)[0];
    // Orientar pedra
    const pedraOrientada = orientarPedra(gameState.mesa, pedraJogada, pos);
    // Adicionar pedra na mesa
    if (pos === 'esquerda') gameState.mesa.unshift(pedraOrientada);
    else gameState.mesa.push(pedraOrientada);
    // Verificar fim de rodada
    if (gameState.jogadores[jogadorIdx].pedras.length === 0) {
      gameState.estado = 'rodada_fim';
      const duplaVencedora = getDuplaVencedoraRodada();
      if (duplaVencedora !== null) {
        gameState.placar[duplaVencedora] += 1; // 1 ponto por vitória
      }
      io.emit('rodada_vencida', { dupla: duplaVencedora, nomes: gameState.duplas[duplaVencedora] });
      syncStateToAll();
      iniciarNovaRodadaComDelay();
      callback && callback({ ok: true });
      return;
    } else {
      // Passar a vez
      gameState.vez = (gameState.vez + 1) % 4;
    }
    // Resetar toques ao jogar
    toquesSeguidos = 0;
    syncStateToAll();
    callback && callback({ ok: true });
  });

  socket.on('toque', (callback) => {
    const jogadorIdx = gameState.jogadores.findIndex(j => j.socketId === socket.id);
    if (gameState.vez !== jogadorIdx || gameState.estado !== 'jogando') {
      callback && callback({ ok: false, motivo: 'Não é sua vez' });
      return;
    }
    // Passa a vez
    gameState.vez = (gameState.vez + 1) % 4;
    io.emit('toque', { jogador: gameState.jogadores[jogadorIdx].nome });
    toquesSeguidos++;
    // Se todos tocaram em sequência, fechar rodada
    if (toquesSeguidos >= 4) {
      gameState.estado = 'rodada_fim';
      const duplaVencedora = getDuplaMenorSoma();
      if (duplaVencedora !== null) {
        gameState.placar[duplaVencedora] += 1; // 1 ponto por fechamento
      }
      io.emit('rodada_vencida', { dupla: duplaVencedora, nomes: gameState.duplas[duplaVencedora] });
      syncStateToAll();
      iniciarNovaRodadaComDelay();
      toquesSeguidos = 0;
      callback && callback({ ok: true });
      return;
    }
    syncStateToAll();
    callback && callback({ ok: true });
  });
});

function getPublicGameState() {
  // Retorna o estado do jogo sem expor as pedras dos outros jogadores
  return {
    jogadores: gameState.jogadores.map(j => ({
      id: j.id,
      nome: j.nome,
      dupla: j.dupla,
      pedras: j.pedras.length, // só mostra a quantidade
    })),
    duplas: gameState.duplas,
    vez: gameState.vez,
    mesa: gameState.mesa,
    dorme: gameState.dorme.length,
    placar: gameState.placar,
    rodada: gameState.rodada,
    pontosRodada: gameState.pontosRodada,
    estado: gameState.estado,
    historico: gameState.historico,
    empatesSeguidos: gameState.empatesSeguidos,
  };
}

function syncStateToAll() {
  io.emit('estado', getPublicGameState());
  gameState.jogadores.forEach(jogador => {
    const socketJogador = io.sockets.sockets.get(jogador.socketId);
    if (socketJogador) {
      socketJogador.emit('minhas-pedras', jogador.pedras);
    }
  });
}

function getDuplaVencedoraRodada() {
  // Se algum jogador ficou sem peças, sua dupla vence
  const vencedor = gameState.jogadores.find(j => j.pedras.length === 0);
  if (vencedor) return vencedor.dupla;
  return null;
}

function getDuplaMenorSoma() {
  // Soma os valores das pedras de cada dupla
  const soma = [0, 0];
  gameState.jogadores.forEach(j => {
    const total = j.pedras.reduce((acc, p) => acc + p[0] + p[1], 0);
    soma[j.dupla] += total;
  });
  if (soma[0] < soma[1]) return 0;
  if (soma[1] < soma[0]) return 1;
  // Empate: retorna null (pode tratar depois)
  return null;
}

function iniciarNovaRodadaComDelay() {
  setTimeout(() => {
    gameState.iniciarRodada();
    syncStateToAll();
  }, 4000); // 4 segundos para mostrar o vencedor
}

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 