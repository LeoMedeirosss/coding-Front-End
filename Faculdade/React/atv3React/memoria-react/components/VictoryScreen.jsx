import React from 'react';

function VictoryScreen({ jogadores, pontuacoes, onRestart }) {
  const max = Math.max(...pontuacoes);
  const vencedores = jogadores.filter((_, i) => pontuacoes[i] === max);
  const resultado = vencedores.length > 1
    ? `Empate entre: ${vencedores.join(" e ")} com ${max} ponto(s)!`
    : `Vencedor: ${vencedores[0]} com ${max} ponto(s)!`;

  return (
    <div id="vitoria">
      <h2>🎉 Jogo Finalizado!</h2>
      <div id="resultadoFinal">{resultado}</div>
      <button onClick={onRestart}>Voltar para o início</button>
    </div>
  );
}

export default VictoryScreen;