@echo off
echo [1/3] A iniciar o MySQL pelo XAMPP...
:: Ajuste se o XAMPP estiver instalado noutra unidade ou diretoria
start "" "C:\xampp\mysql\bin\mysqld.exe"

:: Aguarda 4 segundos para garantir que o banco de dados ligou completamente
timeout /t 4 /nobreak > NUL

echo [2/3] A iniciar o backend (FastAPI)...
:: Substitua pelo caminho exato da pasta do seu backend
cd "C:\Nova pasta\lobios-eniac_2"
start cmd /k "uvicorn src.main.server.server:app --port 3001 --reload"

echo [3/3] A abrir a interface do Frontend...
:: Substitua pelo caminho exato da pasta onde está o seu index.html
cd "C:\Nova pasta\lobios-eniac_2\front"

:: Abre o index.html diretamente no navegador padrão
start index.html

echo Inicializacao concluida!
exit