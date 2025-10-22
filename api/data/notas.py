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
            Nota(avaliacao=avaliacoes[1], nota=9),
            Nota(avaliacao=avaliacoes[2], nota=7),
            Nota(avaliacao=avaliacoes[13], nota=4),
            Nota(avaliacao=avaliacoes[15], nota=3),
            Nota(avaliacao=avaliacoes[20], nota=2),
        ]
    },
    {
        "aluno_id": 2,
        "notas": [
            Nota(avaliacao=avaliacoes[0], nota=9),
            Nota(avaliacao=avaliacoes[1], nota=10),
            Nota(avaliacao=avaliacoes[2], nota=8),
            Nota(avaliacao=avaliacoes[3], nota=7),
            Nota(avaliacao=avaliacoes[4], nota=8),
            Nota(avaliacao=avaliacoes[5], nota=6),
            Nota(avaliacao=avaliacoes[13], nota=3),
            Nota(avaliacao=avaliacoes[14], nota=2),
            Nota(avaliacao=avaliacoes[15], nota=4),
        ]
    },
    {
        "aluno_id": 3,
        "notas": [
            Nota(avaliacao=avaliacoes[1], nota=7),
            Nota(avaliacao=avaliacoes[2], nota=6),
            Nota(avaliacao=avaliacoes[4], nota=8),
            Nota(avaliacao=avaliacoes[5], nota=9),
            Nota(avaliacao=avaliacoes[0], nota=8),
            Nota(avaliacao=avaliacoes[3], nota=7),
            Nota(avaliacao=avaliacoes[14], nota=3),
            Nota(avaliacao=avaliacoes[16], nota=2),
            Nota(avaliacao=avaliacoes[22], nota=4),
        ]
    },
    {
        "aluno_id": 4,
        "notas": [
            Nota(avaliacao=avaliacoes[0], nota=6),
            Nota(avaliacao=avaliacoes[2], nota=7),
            Nota(avaliacao=avaliacoes[3], nota=8),
            Nota(avaliacao=avaliacoes[5], nota=7),
            Nota(avaliacao=avaliacoes[1], nota=8),
            Nota(avaliacao=avaliacoes[4], nota=6),
            Nota(avaliacao=avaliacoes[13], nota=3),
            Nota(avaliacao=avaliacoes[17], nota=2),
            Nota(avaliacao=avaliacoes[19], nota=4),
        ]
    },
    {
        "aluno_id": 5,
        "notas": [
            Nota(avaliacao=avaliacoes[1], nota=8),
            Nota(avaliacao=avaliacoes[2], nota=9),
            Nota(avaliacao=avaliacoes[3], nota=6),
            Nota(avaliacao=avaliacoes[4], nota=7),
            Nota(avaliacao=avaliacoes[0], nota=7),
            Nota(avaliacao=avaliacoes[5], nota=8),
            Nota(avaliacao=avaliacoes[14], nota=2),
            Nota(avaliacao=avaliacoes[19], nota=3),
            Nota(avaliacao=avaliacoes[26], nota=4),
        ]
    },
]