from pydantic import BaseModel
from typing import List, Dict, Optional
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

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
    id: int = None
    nome: str
    sexo: str
    notas: List[Nota] = []

class Falta(BaseModel):
    data: str
    materia: Materia
    tipo: str

class MateriaItem(BaseModel):
    id: str
    label: str

class TurmaAluno(Aluno):
    notas: Dict[str, float] = Field(default_factory=dict)
    frequencia: Dict[str, float] = Field(default_factory=dict)
    faltas: List[date] = Field(default_factory=list)

class Turma(BaseModel):
    id: int
    nome: str
    turno: str
    materias: List[MateriaItem] = Field(default_factory=list)
    alunos: List[TurmaAluno] = Field(default_factory=list)  