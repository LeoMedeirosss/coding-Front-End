const apiUrl = "http://localhost:3000/pessoas";

document.getElementById("pessoaForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const cpf = document.getElementById("cpf").value;
  const nome = document.getElementById("nome").value;
  const renda = parseFloat(document.getElementById("renda").value);
  const nascimento = document.getElementById("nascimento").value;
  const hoje = new Date().toISOString().split("T")[0];

  if (!cpf || !nome || isNaN(renda) || !nascimento) {
    alert("Todos os campos são obrigatórios.");
    return;
  }

  if (renda <= 0) {
    alert("A renda deve ser maior que 0.");
    return;
  }

  if (nascimento > hoje) {
    alert("Data de nascimento deve ser menor ou igual à data atual.");
    return;
  }

  const pessoa = { id: cpf, nome, renda, nascimento };

  // Verifica se já existe o CPF (para decidir se atualiza ou cria)
  const res = await fetch(`${apiUrl}/${cpf}`);
  if (res.ok) {
    await fetch(`${apiUrl}/${cpf}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pessoa)
    });
  } else {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pessoa)
    });
  }

  carregarPessoas();
  this.reset();
});

async function carregarPessoas() {
  const res = await fetch(apiUrl);
  const pessoas = await res.json();

  const tabela = document.getElementById("tabelaPessoas");
  tabela.innerHTML = "";

  pessoas.forEach(pessoa => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${pessoa.id}</td>
      <td>${pessoa.nome}</td>
      <td>${pessoa.renda}</td>
      <td>${pessoa.nascimento}</td>
      <td><button onclick="deletarPessoa('${pessoa.id}')">Excluir</button></td>
    `;
    tabela.appendChild(linha);
  });
}

async function deletarPessoa(cpf) {
  await fetch(`${apiUrl}/${cpf}`, { method: "DELETE" });
  carregarPessoas();
}

carregarPessoas();
