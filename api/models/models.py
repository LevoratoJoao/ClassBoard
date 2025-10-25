from pydantic import BaseModel
from typing import List
from enum import Enum
from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    is_active: bool = True

class UserInDB(User):
    hashed_password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Materia(str, Enum):
    PORTUGUES = "Portugues"
    MATEMATICA = "Matematica"
    CIENCIAS = "Ciencias"
    GEOGRAFIA = "Geografia"
    HISTORIA = "Historia"
    ARTES = "Artes"

class Turma(BaseModel):
    id: int
    nome: str
    ano: int
    alunos: List["Aluno"] = []

class Avaliacao(BaseModel):
    id: int
    materia: Materia
    tipo: str
    bimestre: int

class Nota(BaseModel):
    avaliacao: Avaliacao
    nota: int

class Aluno(BaseModel):
    nome: str
    sexo: str
    notas: List[Nota] = []