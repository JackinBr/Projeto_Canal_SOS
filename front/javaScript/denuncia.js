function contadorTestemunhas() {
    let testemunhas = document.getElementById('testemunhas').value.length;
    document.getElementById('contadorTestemunhas').textContent = testemunhas;
}

// Checkbox "anônimo": esconde nome e e-mail
function semNome() {
    const anonimo = document.getElementById('campoNome').checked;
    document.getElementById('dadosContato').style.display = anonimo ? 'none' : 'block';
    if (anonimo) {
        document.getElementById('nome').value = '';
        document.getElementById('email').value = '';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // A mensagem de sucesso começa escondida
    document.getElementById('msgSucesso').style.display = 'none';

    document.getElementById('formDenuncia').addEventListener('submit', function (evento) {
        evento.preventDefault();
        enviarFormulario();
    });
});

function enviarFormulario() {
    const formDenuncia = {
        tipo_denuncia:     document.getElementById('tipoDenuncia').value || null,
        setor:             document.getElementById('setor').value || null,
        local:             document.getElementById('local').value.trim() || null,
        pessoas_envolvidas: document.getElementById('envolvidos').value.trim() || null, // Corrigido para plural
        descricao:         document.getElementById('descricao').value.trim() || null,
        testemunhas:       document.getElementById('testemunhas').value.trim() || null,
        nome:              document.getElementById('nome').value.trim() || null,
        email:             document.getElementById('email').value.trim() || null
    };

    // URL completa da sua API
    fetch('http://localhost:3001/denuncias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDenuncia)
    })
    .then(resposta => resposta.json().then(dados => ({ ok: resposta.ok, dados: dados })))
    .then(({ ok, dados }) => {
        if (!ok) {
            alert(dados.detail || 'Não foi possível enviar. Tente novamente.');
            return;
        }
        document.getElementById('formDenuncia').style.display = 'none';
        document.getElementById('msgSucesso').style.display = 'block';
        // A API devolve { "mensagem": "...", "id": X }
        document.getElementById('numeroProtocolo').textContent = `DEN-${dados.id || 'OK'}`;
    })
    .catch(err => {
        console.error('Erro no fetch ', err);
        alert('Erro ao conectar com o servidor.');
    });
}