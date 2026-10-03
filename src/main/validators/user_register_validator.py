from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class UserLoginValidator(BaseModel):
    email: EmailStr
    senha: str

class UsuarioCreateValidator(BaseModel):
    nome: str = Field(..., max_length=50)
    email: EmailStr
    senha: str = Field(..., min_length=6)

class CriticaCreateValidator(BaseModel):
    setor: Optional[str] = Field(None, max_length=20)
    assunto: Optional[str] = Field(None, max_length=100)
    descricao: Optional[str] = Field(None, max_length=700)
    sugestao: Optional[str] = Field(None, max_length=400)
    nome: Optional[str] = Field(None, max_length=50) # Opcional para anonimato

class DenunciaCreateValidator(BaseModel):
    tipo_denuncia: Optional[str] = Field(None, max_length=30)
    setor: Optional[str] = Field(None, max_length=20)
    local: Optional[str] = Field(None, max_length=30)
    pessoas_envolvidas: Optional[str] = Field(None, max_length=200)
    descricao: Optional[str] = Field(None, max_length=800)
    testemunhas: Optional[str] = Field(None, max_length=400)
    nome: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None

class ReclamacaoCreateValidator(BaseModel):
    categoria: Optional[str] = Field(None, max_length=25)
    setor: Optional[str] = Field(None, max_length=20)
    nivel_urgencia: Optional[str] = Field(None, max_length=5)
    resumo_reclamacao: Optional[str] = Field(None, max_length=100)
    descricao: Optional[str] = Field(None, max_length=800)
    tentou_resolver: Optional[str] = Field(None, max_length=3)
    sugestao: Optional[str] = Field(None, max_length=400)
    nome: Optional[str] = Field(None, max_length=50)