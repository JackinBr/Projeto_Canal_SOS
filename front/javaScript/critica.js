function contadorSugestao() {
    let sugestao = document.getElementById('sugestao').value.length;
    document.getElementById('contadorSugestao').textContent = sugestao;
}

// Checkbox "anônimo": esconde o campo de nome
function semNome() {
    const anonimo = document.getElementById('anonimo').checked;
    document.getElementById('campoNome').style.display = anonimo ? 'none' : 'flex';
    if (anonimo) document.getElementById('nome').value = '';
}

function enviarFormulario() {
    const formularioCritica = {
        setor:     document.getElementById('setor').value,
        assunto:   document.getElementById('assunto').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        sugestao:  document.getElementById('sugestao').value.trim(),
        nome:      document.getElementById('nome').value.trim()
    };

    // O botão não é "submit", então a validação do HTML (required) precisa ser feita aqui
    if (!formularioCritica.setor || !formularioCritica.assunto || !formularioCritica.descricao) {
        alert('Preencha o setor, o assunto e a descrição.');
        return;
    }

    fetch('/api/uploads/critica', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formularioCritica)
    })
    .then(resposta => resposta.json().then(dados => ({ ok: resposta.ok, dados: dados })))
    .then(({ ok, dados }) => {
        if (!ok) {
            alert(dados.erro || 'Não foi possível enviar. Tente novamente.');
            return;
        }
        document.getElementById('formulario').style.display = 'none';
        document.getElementById('mensagemSucesso').style.display = 'block';
        document.getElementById('mensagem').textContent = 'Sua manifestação foi registrada. Guarde o protocolo:';
        document.getElementById('numeroProtocolo').textContent = `CRI-${dados.id}`;
    })
    .catch(err => {
        console.error('Erro no fetch ', err);
        alert('Erro ao conectar com o servidor.');
    });
}