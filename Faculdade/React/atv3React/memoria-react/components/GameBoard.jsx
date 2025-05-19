import React, { useState, useEffect } from 'react';
import ScoreBoard from './ScoreBoard';
import Card from './Card';

function GameBoard({ config, imagens, onGameEnd }) {
  const [cartas, setCartas] = useState([]);
  const [primeiraCarta, setPrimeiraCarta] = useState(null);
  const [travado, setTravado] = useState(false);
  const [gameState, setGameState] = useState({
    jogadores: config.jogadores,
    pontuacoes: [...config.pontuacoes],
    jogadorAtual: config.jogadorAtual,
    totalPares: config.totalPares,
    paresEncontrados: config.paresEncontrados
  });

  useEffect(() => {
    criarTabuleiro();
  }, []);

  const criarTabuleiro = () => {
    const selecionadas = imagens.slice(0, gameState.totalPares);
    const cartasDuplicadas = [...selecionadas, ...selecionadas];
    cartasDuplicadas.sort(() => Math.random() - 0.5);

    const cartasFormatadas = cartasDuplicadas.map((simbolo, index) => ({
      id: index,
      simbolo,
      revelada: false,
      encontrada: false
    }));

    setCartas(cartasFormatadas);
  };

  const virarCarta = (carta) => {
    if (travado || carta.revelada || carta.encontrada) return;

    const novasCartas = [...cartas];
    const cartaIndex = novasCartas.findIndex(c => c.id === carta.id);
    novasCartas[cartaIndex] = { ...novasCartas[cartaIndex], revelada: true };
    setCartas(novasCartas);

    if (!primeiraCarta) {
      setPrimeiraCarta(novasCartas[cartaIndex]);
    } else {
      if (primeiraCarta.simbolo === novasCartas[cartaIndex].simbolo) {
        // Par encontrado
        const novasPontuacoes = [...gameState.pontuacoes];
        novasPontuacoes[gameState.jogadorAtual]++;
        
        setGameState(prev => ({
          ...prev,
          pontuacoes: novasPontuacoes,
          paresEncontrados: prev.paresEncontrados + 1
        }));

        setTimeout(() => {
          const cartasAtualizadas = [...novasCartas];
          cartasAtualizadas[cartaIndex].encontrada = true;
          cartasAtualizadas[cartas.findIndex(c => 
            c.id === primeiraCarta.id && c.simbolo === primeiraCarta.simbolo
          )].encontrada = true;
          setCartas(cartasAtualizadas);
          setPrimeiraCarta(null);
          checarFimDoJogo(novasPontuacoes);
        }, 500);
      } else {
        // Par não encontrado
        setTravado(true);
        setTimeout(() => {
          const cartasAtualizadas = [...novasCartas];
          cartasAtualizadas[cartaIndex].revelada = false;
          cartasAtualizadas[cartas.findIndex(c => 
            c.id === primeiraCarta.id
          )].revelada = false;
          setCartas(cartasAtualizadas);
          setPrimeiraCarta(null);
          setTravado(false);
          setGameState(prev => ({
            ...prev,
            jogadorAtual: (prev.jogadorAtual + 1) % prev.jogadores.length
          }));
        }, 1000);
      }
    }
  };

  const checarFimDoJogo = (pontuacoesAtuais) => {
    if (gameState.paresEncontrados + 1 === gameState.totalPares) {
      onGameEnd(pontuacoesAtuais);
    }
  };

  const calcularColunas = () => {
    if (cartas.length === 0) return 4;
    return Math.ceil(Math.sqrt(cartas.length));
  };

  return (
    <>
      <ScoreBoard 
        jogadores={gameState.jogadores} 
        pontuacoes={gameState.pontuacoes} 
        jogadorAtual={gameState.jogadorAtual} 
      />
      
      <div 
        id="tabuleiro" 
        className="grid" 
        style={{ gridTemplateColumns: `repeat(${calcularColunas()}, 1fr)` }}
      >
        {cartas.map((carta) => (
          <Card 
            key={carta.id}
            carta={carta}
            onClick={() => virarCarta(carta)}
          />
        ))}
      </div>
    </>
  );
}

export default GameBoard;