const botaoMobile = document.getElementById("botao-mobile");
const menu = document.getElementById("menu");

const cartoes = document.querySelectorAll(".cartao-opcao");
const areaContinuar = document.getElementById("area-continuar");
const tipoSelecionado = document.getElementById("tipo-selecionado");
const botaoContinuar = document.getElementById("botao-continuar");

let escolha = "";

/* Abre e fecha o menu no celular */
botaoMobile.addEventListener("click", function () {
    menu.classList.toggle("aberto");
});

/* Fecha o menu depois que um link for selecionado */
menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        menu.classList.remove("aberto");
    });
});

/* Identifica a opção escolhida pelo funcionário */
cartoes.forEach(function (cartao) {
    cartao.addEventListener("click", function () {
        cartoes.forEach(function (outroCartao) {
            outroCartao.classList.remove("selecionado");
        });

        cartao.classList.add("selecionado");

        escolha = cartao.dataset.tipo;

        tipoSelecionado.textContent = escolha;
        areaContinuar.classList.add("visivel");
    });
});

/* Guarda a escolha e abre o formulário */
botaoContinuar.addEventListener("click", function () {
    if (escolha === "") {
        alert("Escolha um tipo de manifestação.");
        return;
    }

    localStorage.setItem("tipoManifestacao", escolha);

    window.location.href = "denuncia.html";
});


function contadorDescricao(){
    let descricao = document.getElementById('descricao').value.length;
    document.getElementById('contadorDescricao').textContent = descricao
    console.log(descricao);
}