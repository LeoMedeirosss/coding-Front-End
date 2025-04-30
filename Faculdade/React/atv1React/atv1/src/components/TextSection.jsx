import React from 'react';

const TextSection = () => {
  const longText = `
    A inteligência artificial (IA) está transformando radicalmente o mundo em que vivemos. 
    Desde assistentes virtuais até carros autônomos, a IA está se tornando cada vez mais 
    presente em nossas vidas diárias. Mas o que exatamente é inteligência artificial?
    
    Em termos simples, IA refere-se a sistemas ou máquinas que imitam a inteligência humana 
    para realizar tarefas e podem se aprimorar iterativamente com base nas informações que 
    coletam. A IA se manifesta de várias formas. Alguns exemplos incluem:
    
    - Chatbots que usam IA para entender mais rapidamente os problemas dos clientes e 
      fornecer respostas mais eficientes
    - Assistentes inteligentes que usam IA para analisar informações críticas de grandes 
      conjuntos de dados de texto livre para melhorar o agendamento
    - Motores de recomendação que podem sugerir automaticamente opções de TV com base nos 
      hábitos de visualização dos usuários
    
    A IA está por trás de muito do que experimentamos em nossos dias:
    
    * Pesquisa na internet
    * Recomendações de produtos
    * Previsões de tráfego em tempo real
    * Tradução automática
    * Reconhecimento facial
    
    Embora a IA ofereça muitos benefícios, também apresenta desafios éticos e preocupações 
    sobre privacidade, viés algorítmico e impacto no emprego. À medida que a tecnologia avança, 
    é crucial desenvolver estruturas éticas para garantir que a IA seja usada de maneira 
    responsável e benéfica para a sociedade como um todo.
    
    O futuro da IA é tanto emocionante quanto incerto. Com avanços contínuos em aprendizado 
    de máquina, processamento de linguagem natural e robótica, a IA continuará a transformar 
    indústrias e a maneira como interagimos com a tecnologia. Cabe a nós moldar esse futuro 
    de forma a maximizar seus benefícios enquanto mitigamos seus riscos.
  `;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>Inteligência Artificial</h2>
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '10px', 
        border: '1px solid #eee',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
      }}>
        <p style={{ whiteSpace: 'pre-line', textAlign: 'justify' }}>{longText}</p>
      </div>
    </div>
  );
};

export default TextSection;