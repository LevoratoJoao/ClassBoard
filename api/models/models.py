from pydantic import BaseModel
from typing import List

class Avaliacao(BaseModel):
    id: int
    materia: str
    tipo: str
    bimestre: int

class Nota(BaseModel):
    avaliacao: Avaliacao
    nota: int

class Aluno(BaseModel):
    nome: str
    sexo: str
    notas: List[Nota] = []