from pydantic import BaseModel
from typing import List
from enum import Enum

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

class Falta(BaseModel):
    data: str
    materia: Materia
    tipo: str