function contarPalavras() {
    let texto = document.getElementById("texto").value;
    let palavras = texto.trim().split(/\s+/);
    document.getElementById("resultado").innerText = "Total de palavras: " + palavras.length;
}

function trocarPalavras() {
    let texto = document.getElementById("texto").value;
    let proibidas = document.getElementById("palavrasProibidas").value.split(",").map(p => p.trim());
    let novas = document.getElementById("palavrasNovas").value.split(",").map(p => p.trim());
    
    proibidas.forEach((palavra, index) => {
        if (palavra && novas[index]) {
            let regex = new RegExp(`\\b${palavra}\\b`, "gi");
            texto = texto.replace(regex, novas[index]);
        }
    });
    
    document.getElementById("texto").value = texto;
}

function limparCampos() {
    document.getElementById("texto").value = "";
    document.getElementById("palavrasProibidas").value = "";
    document.getElementById("palavrasNovas").value = "";
    document.getElementById("resultado").innerText = "";
}
