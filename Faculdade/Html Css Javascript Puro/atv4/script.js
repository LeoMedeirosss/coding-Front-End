class Conta {
    constructor(nome, saldo) {
      this.nome = nome;
      this.saldo = saldo;
    }
  
    validarValor(valor) {
      return valor > 0;
    }
  
    creditar(valor) {
      if (!this.validarValor(valor)) {
        alert("Valor inválido para crédito!");
        return false;
      }
      this.saldo += valor;
      return true;
    }
  
    debitar(valor) {
      if (!this.validarValor(valor)) {
        alert("Valor inválido para débito!");
        return false;
      }
      if (valor > this.saldo) {
        alert("Saldo insuficiente!");
        return false;
      }
      this.saldo -= valor;
      return true;
    }
  }
  
  let contas = [
    new Conta("João Silva", 1500),
    new Conta("Maria Souza", 2000),
    new Conta("Carlos Lima", 1000),
    new Conta("Ana Costa", 2500),
    new Conta("Paulo Mendes", 1800)
  ];
  
  function atualizarTabela() {
    const corpoTabela = document.querySelector("#tabelaContas tbody");
    corpoTabela.innerHTML = "";
    contas.forEach(conta => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${conta.nome}</td>
        <td>R$ ${conta.saldo.toFixed(2)}</td>
      `;
      corpoTabela.appendChild(linha);
    });
  }
  
  function ordenarPor(campo) {
    contas.sort((a, b) => {
      if (campo === "nome") {
        return a.nome.localeCompare(b.nome);
      } else {
        return a.saldo - b.saldo;
      }
    });
    atualizarTabela();
  }
  
  function realizarOperacao() {
    const valor = parseFloat(document.getElementById("valorOperacao").value);
    const nome = document.getElementById("nomeCorrentista").value.trim();
    const operacao = document.querySelector("input[name='operacao']:checked").value;
  
    if (!nome || isNaN(valor)) {
      alert("Preencha todos os campos corretamente!");
      return;
    }
  
    const conta = contas.find(c => c.nome.toLowerCase() === nome.toLowerCase());
  
    if (!conta) {
      alert("Correntista não encontrado!");
      return;
    }
  
    const sucesso = operacao === "credito" ? conta.creditar(valor) : conta.debitar(valor);
  
    if (sucesso) {
      atualizarTabela();
      alert("Operação realizada com sucesso!");
    }
  }
  
  window.onload = atualizarTabela;
  