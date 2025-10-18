from models.models import Aluno, Nota
from data.avaliacoes import avaliacoes

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