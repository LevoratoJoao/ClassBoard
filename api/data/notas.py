from models.models import Nota
from data.avaliacoes import avaliacoes

notas_por_aluno = [
    {
        "aluno_id": 1,
        "notas": [
            Nota(avaliacao=avaliacoes[0], nota=8),
            Nota(avaliacao=avaliacoes[3], nota=7),
            Nota(avaliacao=avaliacoes[4], nota=6),
            Nota(avaliacao=avaliacoes[5], nota=5),
        ]
    },
    {
        "aluno_id": 2,
        "notas": [
            Nota(avaliacao=avaliacoes[0], nota=9),
            Nota(avaliacao=avaliacoes[1], nota=10),
            Nota(avaliacao=avaliacoes[2], nota=8),
            Nota(avaliacao=avaliacoes[3], nota=7),
        ]
    },
]