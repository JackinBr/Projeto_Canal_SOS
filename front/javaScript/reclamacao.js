function contadorSolucao() {
    let solucao = document.getElementById('solucao').value.length;
    document.getElementById('contadorSolucao').textContent = solucao;
}

// Checkbox "anônimo": esconde o campo de nome.
// No HTML o checkbox e a div têm o mesmo id (campoNome), por isso os seletores abaixo são específicos.
function semNome() {
    const anonimo = document.querySelector('input#campoNome').checked;
    document.querySelector('div#campoNome').style.display = anonimo ? 'none' : 'block';
    if (anonimo) document.getElementById('nome').value = '';
}

function tentouResolver() {
    const marcado = document.querySelector('input[name="tentou-resolver"]:checked');
    return marcado ? marcado.value : '';
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formReclamacao').addEventListener('submit', function (evento) {
        evento.preventDefault();
        enviarFormulario();
    });
});

function enviarFormulario() {
    const formReclamacao = {
        categoria:         document.getElementById('categoria').value || null,
        setor:             document.getElementById('setor').value || null,
        nivel_urgencia:    document.getElementById('urgencia').value || null,
        resumo_reclamacao: document.getElementById('assunto').value.trim() || null,
        descricao:         document.getElementById('descricao').value.trim() || null,
        tentou_resolver:   tentouResolver() || null,
        sugestao:          document.getElementById('solucao').value.trim() || null,
        nome:              document.getElementById('nome').value.trim() || null
    };

    // URL completa da sua API
    fetch('http://localhost:3001/reclamacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formReclamacao)
    })
    .then(resposta => resposta.json().then(dados => ({ ok: resposta.ok, dados: dados })))
    .then(({ ok, dados }) => {
        if (!ok) {
            alert(dados.detail || 'Não foi possível enviar. Tente novamente.');
            return;
        }
        document.getElementById('formulario').style.display = 'none'; // Ajuste o ID se necessário
        document.getElementById('msgSucesso').style.display = 'block';
        document.getElementById('numeroProtocolo').textContent = `REC-${dados.id || 'OK'}`;
    })
    .catch(err => {
        console.error('Erro no fetch ', err);
        alert('Erro ao conectar com o servidor.');
    });
}