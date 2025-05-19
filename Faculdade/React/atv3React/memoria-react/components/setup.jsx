import React, { useState } from 'react';

function Setup({ imagens, onStart }) {
  const [numJogadores, setNumJogadores] = useState('');
  const [numPecas, setNumPecas] = useState('');
  const [nomesJogadores, setNomesJogadores] = useState([]);

  const gerarInputsNomes = () => {
    const num = parseInt(numJogadores);
    if (isNaN(num) || num < 2 || num > 6) {
      alert("Número de jogadores inválido.");
      return;
    }
    setNomesJogadores(Array(num).fill(''));
  };

  const handleNomeChange = (index, value) => {
    const novosNomes = [...nomesJogadores];
    novosNomes[index] = value;
    setNomesJogadores(novosNomes);
  };

  const iniciarJogo = () => {
    const numJog = parseInt(numJogadores);
    const numPec = parseInt(numPecas);

    if (isNaN(numJog) || numJog < 2 || numJog > 6) {
      alert("Número de jogadores inválido.");
      return;
    }
    if (isNaN(numPec) || numPec < 8 || numPec > 32 || numPec % 2 !== 0) {
      alert("Quantidade de peças inválida.");
      return;
    }

    const jogadoresFinal = nomesJogadores.map((nome, i) => 
      nome.trim() || `Jogador ${i + 1}`
    );

    onStart({
      jogadores: jogadoresFinal,
      pontuacoes: Array(numJog).fill(0),
      jogadorAtual: 0,
      cartas: [],
      totalPares: numPec / 2,
      paresEncontrados: 0
    });
  };

  return (
    <div id="setup">
      <label>
        Quantidade de Jogadores (2 a 6): 
        <input 
          type="number" 
          id="numJogadores" 
          min="2" 
          max="6" 
          value={numJogadores}
          onChange={(e) => setNumJogadores(e.target.value)}
        />
      </label>
      <br />
      
      <div id="nomesJogadores">
        {nomesJogadores.map((nome, index) => (
          <div key={index}>
            <input 
              type="text" 
              placeholder={`Nome do jogador ${index + 1}`}
              value={nome}
              onChange={(e) => handleNomeChange(index, e.target.value)}
            />
            <br />
          </div>
        ))}
      </div>
      
      <label>
        Quantidade de Peças (8 a 32, pares): 
        <input 
          type="number" 
          id="numPecas" 
          min="8" 
          max="32" 
          step="2" 
          value={numPecas}
          onChange={(e) => setNumPecas(e.target.value)}
        />
      </label>
      <br />
      
      <button onClick={gerarInputsNomes}>Gerar Nomes</button>
      <button onClick={iniciarJogo}>Iniciar Jogo</button>
    </div>
  );
}

export default Setup;