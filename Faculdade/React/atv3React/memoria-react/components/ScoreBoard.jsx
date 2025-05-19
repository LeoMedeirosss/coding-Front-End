import React from 'react';

function ScoreBoard({ jogadores, pontuacoes, jogadorAtual }) {
  return (
    <>
      <div id="pontuacao">
        {jogadores.map((nome, i) => (
          <div key={i}>{nome}: {pontuacoes[i]} ponto(s)</div>
        ))}
      </div>
      <div id="turno">Vez de: {jogadores[jogadorAtual]}</div>
    </>
  );
}

export default ScoreBoard;