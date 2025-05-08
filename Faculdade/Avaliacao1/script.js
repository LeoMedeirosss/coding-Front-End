//SCRIPTS

document.addEventListener("DOMContentLoaded", function() {
    let usuarioLogado = sessionStorage.getItem("usuarioLogado"); 

    if (usuarioLogado) {
        document.getElementById("solicitacao-servico").style.display = "inline";
    }
});

//VALIDAÇÕES LOGIN

document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("btn-login");
    const clearButton = document.getElementById("btn-clear");
    const errorMessage = document.getElementById("error-message");

    if (!emailInput || !passwordInput || !loginButton || !clearButton || !errorMessage) {
        console.error("Erro: Um ou mais elementos não foram encontrados no DOM.");
        return;
    }

    // Função para validar e-mail
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Evento de clique no botão "Realizar Login"
    loginButton.addEventListener("click", function() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email) {
            errorMessage.textContent = "O campo de e-mail deve ser preenchido.";
            return;
        }

        if (!validarEmail(email)) {
            errorMessage.textContent = "Por favor, insira um e-mail válido.";
            return;
        }

        if (!password) {
            errorMessage.textContent = "O campo de senha deve ser preenchido.";
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

        if (usuarios[email] && usuarios[email].senha === password) {
            // Armazena os dados no sessionStorage
            sessionStorage.setItem("usuarioLogado", "true");
            sessionStorage.setItem("nomeUsuario", usuarios[email].nome);
            sessionStorage.setItem("emailUsuario", email);

            alert("Login realizado com sucesso!");
            window.location.href = "../index.html";
        } else {
            errorMessage.textContent = "E-mail ou senha incorretos.";
        }
    });

    // Evento de clique no botão "Limpar"
    clearButton.addEventListener("click", function() {
        emailInput.value = "";
        passwordInput.value = "";
        errorMessage.textContent = "";
        emailInput.focus();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = sessionStorage.getItem("usuarioLogado") === "true";

    const btnLogin = document.getElementById("btn-login");
    const btnCadastrar = document.getElementById("btn-cadastrar");
    const btnLogout = document.getElementById("btn-logout");
    const btnSolicitacao = document.getElementById("solicitacao-servico");
    const btnTrocarSenha = document.getElementById("trocar-senha");
    const mensagemBemVindo = document.getElementById("bem-vindo");

    if (isLoggedIn) {
        // Oculta botões de login/cadastro
        btnLogin.style.display = "none";
        btnCadastrar.style.display = "none";

        // Mostra botões restritos
        btnLogout.style.display = "inline-block";
        btnSolicitacao.style.display = "inline-block";
        btnTrocarSenha.style.display = "inline-block";

        // Exibe mensagem de boas-vindas
        const nome = sessionStorage.getItem("nomeUsuario");
        mensagemBemVindo.textContent = `Olá, ${nome}!`;
    } else {
        // Usuário não logado: mostra login/cadastro e esconde o resto
        btnLogin.style.display = "inline-block";
        btnCadastrar.style.display = "inline-block";
        btnLogout.style.display = "none";
        btnSolicitacao.style.display = "none";
        btnTrocarSenha.style.display = "none";
        mensagemBemVindo.textContent = "";
    }

    // Evento de logout
    btnLogout.addEventListener("click", function () {
        sessionStorage.clear();
        window.location.reload();
        window.location.href = "../index.html";
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const nomeUsuario = sessionStorage.getItem("nomeUsuario");
    if (nomeUsuario) {
        const bemVindo = document.getElementById("bem-vindo");
        if (bemVindo) {
            bemVindo.textContent = `Olá, ${nomeUsuario}`;
        }
    }
});

//VALIDAÇÕES DE TROCA DE SENHA
document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email");
    const novaSenhaInput = document.getElementById("nova-senha");
    const confirmarSenhaInput = document.getElementById("confirmar-senha");
    const trocarSenhaButton = document.getElementById("btn-trocar-senha");
    const clearButton = document.getElementById("btn-clear");
    const errorMessage = document.getElementById("error-message");

    // Função para validar e-mail
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Função para validar senha
    function validarSenha(senha) {
        const permitido = /[@#$%&*!?/\\|_\-+=.]/;  // Caracteres especiais permitidos
        const proibido = /[¨{}\[\]´`~^:;<>,""']/;  // Caracteres especiais proibidos
        const temNumero = /\d/;
        const temMaiuscula = /[A-Z]/;

        return (
            senha.length >= 6 &&
            temNumero.test(senha) &&
            temMaiuscula.test(senha) &&
            permitido.test(senha) &&
            !proibido.test(senha)
        );
    }

    // Evento de clique no botão "Trocar Senha"
    trocarSenhaButton.addEventListener("click", function() {
        const email = emailInput.value.trim();
        const novaSenha = novaSenhaInput.value.trim();
        const confirmarSenha = confirmarSenhaInput.value.trim();

        if (!email) {
            errorMessage.textContent = "O campo de e-mail deve ser preenchido.";
            return;
        }

        if (!validarEmail(email)) {
            errorMessage.textContent = "Por favor, insira um e-mail válido.";
            return;
        }

        if (!novaSenha) {
            errorMessage.textContent = "O campo de nova senha deve ser preenchido.";
            return;
        }

        if (!validarSenha(novaSenha)) {
            errorMessage.textContent = "A senha não atende aos requisitos.";
            return;
        }

        if (!confirmarSenha) {
            errorMessage.textContent = "O campo de confirmação de senha deve ser preenchido.";
            return;
        }

        if (novaSenha !== confirmarSenha) {
            errorMessage.textContent = "As senhas não coincidem.";
            return;
        }

        // Carregar usuários do localStorage
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

        // Verificar se o e-mail existe
        if (!usuarios[email]) {
            errorMessage.textContent = "E-mail não encontrado.";
            return;
        }

        // Atualizar a senha do usuário
        usuarios[email].senha = novaSenha;

        // Salvar no localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        // Se tudo estiver correto, mostrar mensagem e voltar para a página anterior
        alert("Senha alterada com sucesso!");
        window.history.back();  // Voltar para a página anterior
    });

    // Evento de clique no botão "Limpar"
    clearButton.addEventListener("click", function() {
        emailInput.value = "";
        novaSenhaInput.value = "";
        confirmarSenhaInput.value = "";
        errorMessage.textContent = "";
        emailInput.focus();
    });
});

//VALIDAÇÕES CADASTRO
document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const confirmarSenhaInput = document.getElementById("confirmar-senha");
    const nomeInput = document.getElementById("nome");
    const cpfInput = document.getElementById("cpf");
    const dataNascimentoInput = document.getElementById("data-nascimento");
    const telefoneInput = document.getElementById("telefone");
    const incluirButton = document.getElementById("btn-incluir");
    const clearButton = document.getElementById("btn-clear");
    const voltarButton = document.getElementById("btn-voltar");
    const errorMessage = document.getElementById("error-message");

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarCPF(cpf) {
        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf); 
    }

    function validarSenha(senha) {
        const permitido = /[@#$%&*!?/\\|_\-+=.]/;  // Caracteres especiais permitidos
        const proibido = /[¨{}\[\]´`~^:;<>,""']/;  // Caracteres especiais proibidos
        const temNumero = /\d/;
        const temMaiuscula = /[A-Z]/;
    
        return (
            senha.length >= 6 &&
            temNumero.test(senha) &&
            temMaiuscula.test(senha) &&
            permitido.test(senha) &&
            !proibido.test(senha)
        );
    }

    function validarIdade(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        if (hoje < new Date(nascimento.setFullYear(hoje.getFullYear()))) idade--;
        return idade >= 18;
    }

    incluirButton.addEventListener("click", function() {
        if (!validarEmail(emailInput.value)) {
            errorMessage.textContent = "E-mail inválido.";
            return;
        }

        if (!validarCPF(cpfInput.value)) {
            errorMessage.textContent = "CPF inválido.";
            return;
        }

        if (!validarSenha(senhaInput.value)) {
            errorMessage.textContent = "A senha deve ter pelo menos 6 caracteres, um número, uma letra maiúscula e um caractere especial permitido (@#$%&*!?/\\|_-+=.).";
            return;
        }
    
        if (senhaInput.value !== confirmarSenhaInput.value) {
            errorMessage.textContent = "As senhas não coincidem.";
            return;
        }

        if (!validarIdade(dataNascimentoInput.value)) {
            errorMessage.textContent = "Você deve ser maior de 18 anos.";
            return;
        }

        alert("Validação realizada com sucesso!");

        // Criar ou carregar os usuários do localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

        // Verificar se o e-mail já está cadastrado
        if (usuarios[emailInput.value]) {
            errorMessage.textContent = "Este e-mail já está cadastrado.";
            return;
        }

        // Adiciona o novo usuário
        usuarios[emailInput.value] = {
        nome: nomeInput.value,
        senha: senhaInput.value,
        cpf: cpfInput.value,
        dataNascimento: dataNascimentoInput.value,
        telefone: telefoneInput.value,
        estadoCivil: document.querySelector('input[name="estado-civil"]:checked').value,
        escolaridade: document.getElementById("escolaridade").value
};

        // Salva os usuários no localStorage
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        sessionStorage.setItem("usuarioLogado", "true");
        sessionStorage.setItem("nomeUsuario", nomeInput.value);
        sessionStorage.setItem("emailUsuario", emailInput.value);


        // Redireciona para a tela de login (ou home)
        alert("Usuário cadastrado com sucesso!");
        window.location.href = "../index.html";  // troque pelo nome da página desejada
        });

    clearButton.addEventListener("click", function() {
        emailInput.value = "";
        senhaInput.value = "";
        confirmarSenhaInput.value = "";
        nomeInput.value = "";
        cpfInput.value = "";
        dataNascimentoInput.value = "";
        telefoneInput.value = "";
        document.querySelector('input[name="estado-civil"][value="solteiro"]').checked = true;
        document.getElementById("escolaridade").value = "2g-completo";
        errorMessage.textContent = "";
        emailInput.focus();
    });

    voltarButton.addEventListener("click", function() {
        window.history.back();
    });
});

//INTERATIVITADE CARRINHO 

document.addEventListener("DOMContentLoaded", function () {
    const servicoSelect = document.getElementById("servico");
    const precoInput = document.getElementById("preco");
    const prazoLabel = document.getElementById("prazo");
    const dataPrevistaLabel = document.getElementById("data-prevista");
    const incluirButton = document.getElementById("btn-incluir");
    const tabela = document.querySelector("table tbody");

    const nomeLabel = document.getElementById("nome-usuario");
    const emailLabel = document.getElementById("email-usuario");

    // Recupera os dados do usuário do sessionStorage
    const nomeUsuario = sessionStorage.getItem("nomeUsuario") || "Usuário Desconhecido";
    const emailUsuario = sessionStorage.getItem("emailUsuario") || "email@desconhecido.com";

    // Atualiza os labels com os dados armazenados
    nomeLabel.textContent = nomeUsuario;
    emailLabel.textContent = emailUsuario;

    const servicos = {
        "suporte": { preco: "R$ 150,00", prazo: 1 },
        "backup": { preco: "R$ 200,00", prazo: 2 },
        "seguranca": { preco: "R$ 300,00", prazo: 3 },
        "infra": { preco: "R$ 500,00", prazo: 5 }
    };

    function atualizarInformacoesServico() {
        const servicoSelecionado = servicoSelect.value;
        const dados = servicos[servicoSelecionado];

        precoInput.value = dados.preco;
        prazoLabel.textContent = `${dados.prazo} dia${dados.prazo > 1 ? "s" : ""}`;

        let dataAtual = new Date();
        dataAtual.setDate(dataAtual.getDate() + dados.prazo);
        const dataFormatada = dataAtual.toLocaleDateString("pt-BR");
        dataPrevistaLabel.textContent = dataFormatada;
    }

    function carregarSolicitacoes() {
        const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
        tabela.innerHTML = "";

        solicitacoes.forEach(solicitacao => {
            const novaLinha = document.createElement("tr");
            novaLinha.innerHTML = `
                <td>${solicitacao.dataPedido}</td>
                <td>${solicitacao.numero}</td>
                <td>${solicitacao.servico}</td>
                <td>${solicitacao.status}</td>
                <td>${solicitacao.preco}</td>
                <td>${solicitacao.dataPrevista}</td>
                <td><button class="btn-excluir">Excluir</button></td>
            `;
            tabela.appendChild(novaLinha);
        });
        atualizarEventosExcluir();
    }

    servicoSelect.addEventListener("change", atualizarInformacoesServico);
    atualizarInformacoesServico(); // Para preencher os valores iniciais

    incluirButton.addEventListener("click", function () {
        const dataPedido = new Date().toLocaleDateString("pt-BR");
        const numSolicitacao = (Math.floor(Math.random() * 9000) + 1000).toString();
        const servico = servicoSelect.options[servicoSelect.selectedIndex].text;
        const preco = precoInput.value;
        const dataPrevista = dataPrevistaLabel.textContent;
        const status = "EM ELABORAÇÃO";

        // Carregar solicitações existentes
        const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
        
        // Adicionar nova solicitação
        solicitacoes.push({
            dataPedido,
            numero: numSolicitacao,
            servico,
            status,
            preco,
            dataPrevista
        });

        // Salvar no localStorage
        localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));

        // Atualizar a tabela
        carregarSolicitacoes();
    });

    function atualizarEventosExcluir() {
        document.querySelectorAll(".btn-excluir").forEach(button => {
            button.addEventListener("click", function () {
                const tr = this.closest("tr");
                const numeroSolicitacao = tr.cells[1].textContent;
                
                // Carregar solicitações
                let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
                
                // Remover a solicitação - convertendo para string para garantir comparação correta
                solicitacoes = solicitacoes.filter(s => s.numero.toString() !== numeroSolicitacao);
                
                // Salvar no localStorage
                localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
                
                // Atualizar a tabela
                carregarSolicitacoes();
            });
        });
    }

    // Carregar solicitações ao iniciar
    carregarSolicitacoes();
});