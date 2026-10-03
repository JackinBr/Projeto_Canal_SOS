from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Importações do seu servidor e banco de dados
from src.main.server import server
from src.main.models.models import CriticaDB, DenunciaDB, ReclamacaoDB, AdministradorDB,UsuarioDB

# Importações dos validadores novos (certifique-se de que o ficheiro validators.py tem estas classes)
from src.main.validators.user_register_validator import (
    CriticaCreateValidator, 
    DenunciaCreateValidator, 
    ReclamacaoCreateValidator,
    UserLoginValidator,
    UsuarioCreateValidator 
)

canal_routes = APIRouter(tags=["Canal Anonimo"])

# ==========================================
# ROTAS DO USUÁRIO COMUM (CADASTRO E LOGIN)
# ==========================================

@canal_routes.post("/usuarios", status_code=status.HTTP_201_CREATED)
def criar_usuario(body: UsuarioCreateValidator, db: Session = Depends(server.get_db)):
    # 1. Verifica se o e-mail já existe
    usuario_existente = db.query(UsuarioDB).filter(UsuarioDB.email == body.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado no sistema.")
    
    # 2. Cria o novo usuário
    novo_usuario = UsuarioDB(**body.model_dump())
    
    try:
        db.add(novo_usuario)
        db.commit()
        return {"mensagem": "Conta criada com sucesso!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao criar conta: {str(e)}")

@canal_routes.post("/login/usuario", status_code=status.HTTP_200_OK)
def login_usuario(body: UserLoginValidator, db: Session = Depends(server.get_db)):
    # Busca o usuário comum pelo e-mail
    usuario = db.query(UsuarioDB).filter(UsuarioDB.email == body.email).first()

    # Verifica se existe e se a senha bate
    if not usuario or usuario.senha != body.senha:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    # Retorna os dados para o Angular preencher o formulário automaticamente
    return {
        "mensagem": "Login aprovado", 
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email
        }
    }

@canal_routes.delete("/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_usuario(usuario_id: int, db: Session = Depends(server.get_db)):
    # 1. Procura o utilizador pelo ID numérico
    usuario_db = db.query(UsuarioDB).filter(UsuarioDB.id == usuario_id).first()
    
    # 2. Se não existir, devolve erro 404
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    # 3. Executa a exclusão no banco de dados
    try:
        db.delete(usuario_db)
        db.commit()
        return None # O status 204 (No Content) por padrão não devolve JSON
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao deletar usuário: {str(e)}")
    
@canal_routes.post("/criticas", status_code=status.HTTP_201_CREATED)
def criar_critica(body: CriticaCreateValidator, db: Session = Depends(server.get_db)):
    try:
        nova_critica = CriticaDB(**body.model_dump(exclude_none=True))
        db.add(nova_critica)
        db.commit()
        return {"mensagem": "Crítica registada com sucesso."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao registar: {str(e)}")


@canal_routes.post("/denuncias", status_code=status.HTTP_201_CREATED)
def criar_denuncia(body: DenunciaCreateValidator, db: Session = Depends(server.get_db)):
    try:
        nova_denuncia = DenunciaDB(**body.model_dump(exclude_none=True))
        db.add(nova_denuncia)
        db.commit()
        return {"mensagem": "Denúncia registada de forma segura."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao registar: {str(e)}")


@canal_routes.post("/reclamacoes", status_code=status.HTTP_201_CREATED)
def criar_reclamacao(body: ReclamacaoCreateValidator, db: Session = Depends(server.get_db)):
    try:
        nova_reclamacao = ReclamacaoDB(**body.model_dump(exclude_none=True))
        db.add(nova_reclamacao)
        db.commit()
        return {"mensagem": "Reclamação registada com sucesso."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao registar: {str(e)}")

# ==========================================
# ROTAS ADMINISTRATIVAS
# ==========================================

@canal_routes.post("/login", status_code=status.HTTP_200_OK)
def login_admin(body: UserLoginValidator, db: Session = Depends(server.get_db)):
    # 1. Procura o administrador na nova tabela
    admin_db = db.query(AdministradorDB).filter(AdministradorDB.email == body.email).first()

    # 2. Verifica credenciais (usando senha_hash conforme a sua tabela)
    if not admin_db or admin_db.senha_hash != body.senha:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    return {"mensagem": "Login aprovado", "admin_id": admin_db.id}

@canal_routes.get("/denuncias", status_code=status.HTTP_200_OK)
def listar_denuncias(db: Session = Depends(server.get_db)):
    # Rota para o painel do front-end puxar todas as denúncias
    denuncias = db.query(DenunciaDB).all()
    return denuncias

@canal_routes.get("/manifestacoes", status_code=status.HTTP_200_OK)

def listar_manifestacoes(db: Session = Depends(server.get_db)):
    try:
        # 1. Buscar dados das 3 tabelas
        criticas = db.query(CriticaDB).all()
        denuncias = db.query(DenunciaDB).all()
        reclamacoes = db.query(ReclamacaoDB).all()

        manifestacoes = []

        # 2. Mapear e formatar as Críticas
        for c in criticas:
            manifestacoes.append({
                "protocolo": f"CRI-{c.id}",
                "tipo": "Crítica",
                "assunto": c.assunto,
                "data": c.data,
                "setor": c.setor,
                "autor": c.nome if c.nome else "Anônimo",
                "anonimo": not bool(c.nome),
                "descricao": c.descricao,
                "complemento": c.sugestao if c.sugestao else "Não informado",
                "anexo": "Não informado"
            })

        # 3. Mapear e formatar as Denúncias
        for d in denuncias:
            manifestacoes.append({
                "protocolo": f"DEN-{d.id}",
                "tipo": "Denúncia",
                "assunto": d.tipo_denuncia,
                "data": d.data,
                "setor": d.setor,
                "autor": d.nome if d.nome else "Anônimo",
                "anonimo": not bool(d.nome),
                "descricao": d.descricao,
                "complemento": d.testemunhas if d.testemunhas else "Não informado",
                "anexo": "Não informado"
            })

        # 4. Mapear e formatar as Reclamações
        for r in reclamacoes:
            manifestacoes.append({
                "protocolo": f"REC-{r.id}",
                "tipo": "Reclamação",
                "assunto": r.resumo_reclamacao,
                "data": r.data,
                "setor": r.setor,
                "autor": r.nome if r.nome else "Anônimo",
                "anonimo": not bool(r.nome),
                "descricao": r.descricao,
                "complemento": r.sugestao if r.sugestao else "Não informado",
                "anexo": "Não informado"
            })

        # 5. Ordenar por data (Decrescente: do mais recente para o mais antigo)
        # O FastAPI converte automaticamente os objetos datetime para texto ISO no JSON de saída
        manifestacoes.sort(key=lambda x: x["data"], reverse=True)

        return manifestacoes

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar manifestações: {str(e)}")