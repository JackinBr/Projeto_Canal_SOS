/* JAVASCRIPT CHAMADAS */ 
document.addEventListener("DOMContentLoaded", function () {
    // Configuração do botão Sair
// Configuração do botão Sair
    const btnSair = document.getElementById('btnSair');
    if (btnSair) {
        btnSair.addEventListener('click', function (evento) {
            evento.preventDefault();
            
            // Limpa qualquer dado salvo (opcional, caso você use localStorage no futuro)
            localStorage.clear(); 
            
            // Redireciona diretamente para a página de login
            window.location.href = 'login.html';
        });
    }

    let manifestacoes = [];

    const corpoTabela = document.getElementById("corpoTabela");
    const pesquisa = document.getElementById("pesquisaChamadas");
    const botoesFiltro = document.querySelectorAll(".btnFiltro");
    const estadoVazio = document.getElementById("estadoVazio");
    const tabela = document.getElementById("tabelaChamadas");
    const textoRegistros = document.getElementById("textoRegistros");
    const paginacao = document.getElementById("paginacao");
    const fundoModal = document.getElementById("fundoModal");
    const fecharModal = document.getElementById("fecharModal");
    const btnFecharDetalhes = document.getElementById("btnFecharDetalhes");

    const itensPorPagina = 6;
    let filtroAtual = "Todas";
    let paginaAtual = 1;

    function normalizarTexto(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function obterRegistrosFiltrados() {
        const termo = normalizarTexto(pesquisa.value.trim());

        return manifestacoes.filter(function (item) {
            const correspondeTipo =
                filtroAtual === "Todas" || item.tipo === filtroAtual;

            const correspondePesquisa =
                normalizarTexto(item.protocolo).includes(termo) ||
                normalizarTexto(item.assunto).includes(termo);

            return correspondeTipo && correspondePesquisa;
        });
    }

    function classeDoTipo(tipo) {
        if (tipo === "Denúncia") return "tipoDenuncia";
        if (tipo === "Crítica") return "tipoCritica";
        return "tipoReclamacao";
    }

    function criarLinha(item) {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td><strong>${item.protocolo}</strong></td>
            <td>
                <span class="etiquetaTipo ${classeDoTipo(item.tipo)}">
                    ${item.tipo}
                </span>
            </td>
            <td>${item.assunto}</td>
            <td>${item.data}</td>
            <td class="${item.anonimo ? "anonimoSim" : ""}">
                ${item.anonimo ? "Sim" : "Não"}
            </td>
            <td>
                <button type="button" class="btnDetalhes" data-protocolo="${item.protocolo}">
                    Ver detalhes
                </button>
            </td>
        `;

        return linha;
    }

    function atualizarResumo() {
        document.getElementById("totalTodas").textContent = manifestacoes.length;
        document.getElementById("totalReclamacoes").textContent = manifestacoes.filter(i => i.tipo === "Reclamação").length;
        document.getElementById("totalDenuncias").textContent = manifestacoes.filter(i => i.tipo === "Denúncia").length;
        document.getElementById("totalCriticas").textContent = manifestacoes.filter(i => i.tipo === "Crítica").length;
    }

    function criarPaginacao(totalRegistros) {
        const totalPaginas = Math.ceil(totalRegistros / itensPorPagina);
        paginacao.innerHTML = "";

        if (totalPaginas <= 1) return;

        const anterior = document.createElement("button");
        anterior.type = "button";
        anterior.className = "btnPagina";
        anterior.textContent = "‹";
        anterior.disabled = paginaAtual === 1;
        anterior.addEventListener("click", function () {
            paginaAtual--;
            renderizarTabela();
        });
        paginacao.appendChild(anterior);

        for (let pagina = 1; pagina <= totalPaginas; pagina++) {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = "btnPagina" + (pagina === paginaAtual ? " ativa" : "");
            botao.textContent = pagina;
            botao.addEventListener("click", function () {
                paginaAtual = pagina;
                renderizarTabela();
            });
            paginacao.appendChild(botao);
        }

        const proximo = document.createElement("button");
        proximo.type = "button";
        proximo.className = "btnPagina";
        proximo.textContent = "›";
        proximo.disabled = paginaAtual === totalPaginas;
        proximo.addEventListener("click", function () {
            paginaAtual++;
            renderizarTabela();
        });
        paginacao.appendChild(proximo);
    }

    function renderizarTabela() {
        const registros = obterRegistrosFiltrados();
        const totalPaginas = Math.max(1, Math.ceil(registros.length / itensPorPagina));

        if (paginaAtual > totalPaginas) {
            paginaAtual = totalPaginas;
        }

        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const registrosDaPagina = registros.slice(inicio, fim);

        corpoTabela.innerHTML = "";
        registrosDaPagina.forEach(item => corpoTabela.appendChild(criarLinha(item)));

        const semRegistros = registros.length === 0;
        tabela.style.display = semRegistros ? "none" : "table";
        estadoVazio.style.display = semRegistros ? "block" : "none";

        if (semRegistros) {
            textoRegistros.textContent = "Nenhum registro encontrado";
        } else {
            const primeiro = inicio + 1;
            const ultimo = Math.min(fim, registros.length);
            textoRegistros.textContent = `Mostrando ${primeiro} a ${ultimo} de ${registros.length} registros`;
        }

        criarPaginacao(registros.length);

        document.querySelectorAll(".btnDetalhes").forEach(botao => {
            botao.addEventListener("click", function () {
                abrirDetalhes(botao.dataset.protocolo);
            });
        });
    }

    function preencherTexto(id, texto) {
        document.getElementById(id).textContent = texto || "Não informado";
    }

    function abrirDetalhes(protocolo) {
        const item = manifestacoes.find(registro => registro.protocolo === protocolo);
        if (!item) return;

        preencherTexto("modalProtocolo", item.protocolo);
        preencherTexto("modalTipo", item.tipo);
        preencherTexto("modalData", item.data);
        preencherTexto("modalSetor", item.setor);
        preencherTexto("modalAutor", item.autor);
        preencherTexto("modalAnonimo", item.anonimo ? "Sim" : "Não");
        preencherTexto("modalAssunto", item.assunto);
        preencherTexto("modalDescricao", item.descricao);
        preencherTexto("modalComplemento", item.complemento);
        preencherTexto("modalAnexo", item.anexo);

        fundoModal.classList.add("aberto");
        fundoModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function fecharDetalhes() {
        fundoModal.classList.remove("aberto");
        fundoModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function carregarManifestacoes(dados) {
        if (!Array.isArray(dados)) {
            console.error("Os dados das manifestações precisam ser uma lista.");
            return;
        }
        manifestacoes = dados;
        paginaAtual = 1;

        atualizarResumo();
        renderizarTabela();
    }

    window.carregarManifestacoes = carregarManifestacoes;

async function abrirPainelAdministrativo() {
    try {
        // Atualizado para a URL completa do FastAPI
        const resposta = await fetch("http://localhost:3001/manifestacoes");
        const dados = await resposta.json();

        if (!resposta.ok) {
            // O FastAPI devolve o detalhe do erro na chave 'detail'
            throw new Error(dados.detail || "Erro ao carregar manifestações");
        }

        carregarManifestacoes(dados);
    } catch (erro) {
        console.error("Erro ao carregar manifestações:", erro);
        alert("Não foi possível carregar as manifestações.");
    }
}

    // Filtros por botão
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", function () {
            botoesFiltro.forEach(outroBotao => outroBotao.classList.remove("ativo"));
            botao.classList.add("ativo");
            filtroAtual = botao.dataset.tipo;
            paginaAtual = 1;
            renderizarTabela();
        });
    });

    // Filtro por caixa de pesquisa
    pesquisa.addEventListener("input", function () {
        paginaAtual = 1;
        renderizarTabela();
    });

    // Fechar modal
    fecharModal.addEventListener("click", fecharDetalhes);
    btnFecharDetalhes.addEventListener("click", fecharDetalhes);
    fundoModal.addEventListener("click", function (evento) {
        if (evento.target === fundoModal) fecharDetalhes();
    });
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") fecharDetalhes();
    });

    // Chamada inicial direta para buscar no banco
    abrirPainelAdministrativo();
});