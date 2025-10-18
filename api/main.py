from fastapi import FastAPI
from typing import List
from models.models import Aluno, Avaliacao, Nota

app = FastAPI()

# Example in-memory data
avaliacoes = [
    Avaliacao(id=1, materia="Matematica", tipo="Prova", bimestre=1),
    Avaliacao(id=2, materia="Portugues", tipo="Trabalho", bimestre=2),
]
alunos = [
    Aluno(
        nome="João",
        sexo="masculino",
        notas=[
            Nota(avaliacao=avaliacoes[0], nota=8),
            Nota(avaliacao=avaliacoes[1], nota=7),
        ],
    ),
    Aluno(
        nome="Maria",
        sexo="feminino",
        notas=[
            Nota(avaliacao=avaliacoes[0], nota=9),
            Nota(avaliacao=avaliacoes[1], nota=10),
        ],
    ),
]

@app.get("/alunos", response_model=List[Aluno])
def get_alunos():
    return alunos

@app.get("/avaliacoes", response_model=List[Avaliacao])
def get_avaliacoes():
    return avaliacoes