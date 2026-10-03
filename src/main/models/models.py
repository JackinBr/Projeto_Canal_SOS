from sqlalchemy import Column, Integer, String, DateTime, text
from src.main.server.server import Base

class UsuarioDB(Base):
    __tablename__ = "usuario"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    senha = Column(String(100), nullable=False)

class CriticaDB(Base):
    __tablename__ = "critica"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    setor = Column(String(20))
    data = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    assunto = Column(String(100))
    descricao = Column(String(700))
    sugestao = Column(String(400))
    nome = Column(String(50), nullable=True) # Pode ser nulo para garantir anonimato

class DenunciaDB(Base):
    __tablename__ = "denuncia"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    tipo_denuncia = Column(String(30))
    setor = Column(String(20))
    data = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    local = Column(String(30))
    pessoas_envolvidas = Column(String(200)) # Corrigido typo pessoa_envolvidas
    descricao = Column(String(800))
    testemunhas = Column(String(400))
    nome = Column(String(50), nullable=True)
    email = Column(String(50), nullable=True)

class ReclamacaoDB(Base):
    __tablename__ = "reclamacao"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    categoria = Column(String(25))
    setor = Column(String(20))
    data = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    nivel_urgencia = Column(String(5))
    resumo_reclamacao = Column(String(100))
    descricao = Column(String(800))
    tentou_resolver = Column(String(3))
    sugestao = Column(String(400))
    nome = Column(String(50), nullable=True)

class AdministradorDB(Base):
    __tablename__ = "administrador"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(100), unique=True, nullable=False)
    senha_hash = Column(String(100), nullable=False)