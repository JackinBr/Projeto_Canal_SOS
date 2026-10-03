document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formLoginAdm');
    const mensagemErro = document.getElementById('mensagemErro');

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        mensagemErro.classList.remove('visivel');

// Pega os dados
        const formularioLogin = {
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
            // O backend não precisa da chave 'lembrar', então podemos omitir do JSON
        }
        
        // URL da rota de Login do Admin
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formularioLogin)
        })
        .then(resposta => resposta.json().then(dados => ({ ok: resposta.ok, dados: dados })))
        .then(({ ok, dados }) => {
            if (!ok) {
                // O FastAPI devolve o erro na chave 'detail'
                mensagemErro.textContent = dados.detail || 'Erro ao fazer login';
                mensagemErro.classList.add('visivel');
                return;
            }
            // Sucesso! Vai para a página do painel
            window.location.href = 'chamadas.html';
        })
        })
        .catch(err => {
            console.error('Erro no fetch ', err);
            mensagemErro.textContent = 'Erro ao conectar com o servidor';
            mensagemErro.classList.add('visivel');
        });
    });
