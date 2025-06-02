import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Rules = styled.div`
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 2rem;
  text-align: left;
  line-height: 1.6;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`;

const Input = styled.input`
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  margin-bottom: 1.5rem;
  width: 100%;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2c3e50;
    box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.2);
  }
`;

const Button = styled.button`
  background: #2c3e50;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Error = styled.div`
  color: #d32f2f;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(211, 47, 47, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(211, 47, 47, 0.2);
`;

// --- Componentes da Mesa ---
const MesaContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #2c3e50;
  padding: 2rem;
  color: white;
`;

const Placar = styled.div`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Jogadores = styled.div`
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Mesa = styled.div`
  background: white;
  border-radius: 20px;
  min-height: 150px;
  min-width: 500px;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  position: relative;
`;

const SuasPedras = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const DominoPiece = styled.div`
  background: white;
  border: 2px solid #2c3e50;
  border-radius: 8px;
  width: 50px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 8px 0;
  margin: 0 -2px; /* Remove a borda duplicada entre peças */
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 2px;
    background: #2c3e50;
    transform: translateY(-50%);
  }
`;

const DominoDot = styled.div`
  width: 8px;
  height: 8px;
  background: #2c3e50;
  border-radius: 50%;
  position: absolute;
`;

const DominoSide = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DominoVirado = styled(DominoPiece)`
  background: #2c3e50;
  border-color: #34495e;
`;

// Função para renderizar os pontos do dominó
const renderDots = (value, side) => {
  const dots = [];
  const positions = {
    0: [],
    1: ['center'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
  };

  const dotStyles = {
    'top-left': { top: '15%', left: '25%' },
    'top-right': { top: '15%', right: '25%' },
    'middle-left': { top: '50%', left: '25%', transform: 'translateY(-50%)' },
    'middle-right': { top: '50%', right: '25%', transform: 'translateY(-50%)' },
    'bottom-left': { bottom: '15%', left: '25%' },
    'bottom-right': { bottom: '15%', right: '25%' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  };

  positions[value].forEach(pos => {
    dots.push(<DominoDot key={pos} style={dotStyles[pos]} />);
  });

  return <DominoSide>{dots}</DominoSide>;
};

// Função para determinar a rotação da peça
const getRotation = (currentPiece, previousPiece, position) => {
  if (!previousPiece) return 0;
  
  const [currentTop, currentBottom] = currentPiece;
  const [prevTop, prevBottom] = previousPiece;
  
  // Se estiver jogando à esquerda
  if (position === 'esquerda') {
    if (currentBottom === prevTop) return 0;
    if (currentTop === prevTop) return 180;
    if (currentBottom === prevBottom) return 0;
    if (currentTop === prevBottom) return 180;
  }
  // Se estiver jogando à direita
  else {
    if (currentTop === prevBottom) return 0;
    if (currentBottom === prevBottom) return 180;
    if (currentTop === prevTop) return 0;
    if (currentBottom === prevTop) return 180;
  }
  
  return 0;
};

// Função para renderizar a mesa
const renderMesa = (mesa) => {
  if (mesa.length === 0) return <span style={{ color: '#bbb' }}>Mesa vazia</span>;
  
  return mesa.map((p, i) => {
    const previousPiece = i > 0 ? mesa[i - 1] : null;
    const rotation = getRotation(p, previousPiece, i === 0 ? 'direita' : 'esquerda');
    
    return (
      <DominoPiece 
        key={i} 
        style={{ 
          transform: `rotate(${rotation}deg)`,
          marginLeft: i === 0 ? 0 : '-2px'
        }}
      >
        {renderDots(p[0], 'top')}
        {renderDots(p[1], 'bottom')}
      </DominoPiece>
    );
  });
};

function App() {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [entrou, setEntrou] = useState(false);
  const [jogo, setJogo] = useState(null);
  const [meuId, setMeuId] = useState(null);
  const [minhasPedras, setMinhasPedras] = useState([]);
  const [pedraSelecionada, setPedraSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    socket.on('estado', (estado) => {
      setJogo(estado);
      if (entrou && estado.jogadores) {
        const jogador = estado.jogadores.find(j => j.nome === nome);
        if (jogador) setMeuId(jogador.id);
      }
    });
    return () => {
      socket.off('estado');
    };
  }, [entrou, nome]);

  useEffect(() => {
    socket.on('toque', ({ jogador }) => {
      setMensagem(`${jogador} tocou!`);
      setTimeout(() => setMensagem(''), 2000);
    });
    return () => {
      socket.off('toque');
    };
  }, []);

  useEffect(() => {
    if (!jogo) return;
    if (jogo.estado === 'rodada_fim') {
      setMensagem('Fim da rodada!');
      setTimeout(() => setMensagem(''), 2000);
    }
    if (jogo.estado === 'fim') {
      setMensagem('Fim do jogo!');
    }
  }, [jogo]);

  useEffect(() => {
    socket.on('minhas-pedras', setMinhasPedras);
    return () => socket.off('minhas-pedras');
  }, []);

  useEffect(() => {
    socket.on('rodada_vencida', ({ dupla, nomes }) => {
      setMensagem(`Rodada vencida pela dupla: ${nomes.join(' / ')}`);
      setTimeout(() => setMensagem(''), 4000);
    });
    return () => socket.off('rodada_vencida');
  }, []);

  const handleEntrar = (e) => {
    e.preventDefault();
    setErro('');
    if (!nome.trim()) {
      setErro('Digite seu nome!');
      return;
    }
    setEntrando(true);
    socket.emit('entrar', { nome: nome.trim() }, (res) => {
      setEntrando(false);
      if (!res.ok) {
        setErro(res.motivo);
      } else {
        setEntrou(true);
      }
    });
  };

  // Função para jogar uma pedra
  const handleJogar = (pedra, pos) => {
    socket.emit('jogar', { pedra, pos }, (res) => {
      if (!res.ok) {
        alert(res.motivo);
      } else {
        setPedraSelecionada(null);
      }
    });
  };

  // Função para tocar (passar a vez)
  const handleToque = () => {
    socket.emit('toque', (res) => {
      if (!res.ok) {
        alert(res.motivo);
      }
    });
  };

  // Só pode jogar se for sua vez
  const suaVez = jogo?.vez === meuId;

  if (!entrou) {
    return (
      <Container>
        <Card>
          <Title>DOMINÓ ONLINE</Title>
          <Rules>
            <b>Regras principais:</b><br />
            - 4 jogadores, 2 duplas aleatórias.<br />
            - Cada um recebe 6 pedras, 4 ficam no dorme.<br />
            - Não pode comprar do dorme.<br />
            - Ganha quem baixar todas as peças ou tiver menos pontos se fechar.<br />
            - Partida até 6 pontos.<br />
            - Jogada por vez, 20s para jogar.<br />
          </Rules>
          {erro && <Error>{erro}</Error>}
          <form onSubmit={handleEntrar}>
            <Input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              disabled={entrando}
              maxLength={20}
            />
            <Button type="submit" disabled={entrando}>JOGAR</Button>
          </form>
        </Card>
      </Container>
    );
  }

  // --- Tela da mesa ---
  if (!jogo || meuId === null) {
    return <MesaContainer>Carregando mesa...</MesaContainer>;
  }
  const eu = jogo.jogadores.find(j => j.id === meuId);

  return (
    <MesaContainer>
      {mensagem && <div style={{ color: '#2d7a2d', fontWeight: 'bold', marginBottom: 12 }}>{mensagem}</div>}
      <Placar>
        Placar: {jogo.duplas[0]?.join(' / ')} [{jogo.placar[0]}] x [{jogo.placar[1]}] {jogo.duplas[1]?.join(' / ')}
      </Placar>
      <Jogadores>
        {jogo.jogadores.map(j => (
          <div key={j.id} style={{ fontWeight: j.id === jogo.vez ? 'bold' : 'normal', color: j.id === meuId ? '#2d7a2d' : '#222', borderBottom: j.id === jogo.vez ? '2px solid #2d7a2d' : undefined }}>
            {j.nome} <br />
            {j.id === meuId ? '(você)' : ''}
            <br />Pedras: {j.id === meuId ? minhasPedras.length : j.pedras}
          </div>
        ))}
      </Jogadores>
      <Mesa>
        {renderMesa(jogo.mesa)}
      </Mesa>
      <div>Sua mão:</div>
      <SuasPedras>
        {minhasPedras.map((p, i) => (
          <DominoPiece
            key={i}
            style={{ border: pedraSelecionada === i ? '2px solid #27ae60' : undefined, background: suaVez ? '#fff' : '#eee' }}
            onClick={() => suaVez && setPedraSelecionada(i)}
          >
            {renderDots(p[0], 'top')}
            {renderDots(p[1], 'bottom')}
          </DominoPiece>
        ))}
      </SuasPedras>
      {suaVez && pedraSelecionada !== null && (
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => handleJogar(minhasPedras[pedraSelecionada], 'esquerda')}>Jogar à esquerda</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => handleJogar(minhasPedras[pedraSelecionada], 'direita')}>Jogar à direita</Button>
          <Button style={{ marginLeft: 8, background: '#aaa' }} onClick={() => setPedraSelecionada(null)}>Cancelar</Button>
        </div>
      )}
      {suaVez && pedraSelecionada === null && (
        <div style={{ marginTop: 16 }}>
          <Button style={{ background: '#aaa' }} onClick={handleToque}>Toque (passar a vez)</Button>
        </div>
      )}
      <div style={{ marginTop: 32 }}>
        <b>Pedras dos outros jogadores:</b>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {jogo.jogadores.filter(j => j.id !== meuId).map(j => (
            <div key={j.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div>{j.nome}</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: j.pedras }).map((_, idx) => (
                  <DominoVirado key={idx}>
                    <div style={{ width: '100%', height: '100%', background: '#34495e', borderRadius: '6px' }} />
                  </DominoVirado>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MesaContainer>
  );
}

export default App;
