from models.models import Nota
from data.avaliacoes import avaliacoes

notas_por_aluno = [
    {
        "aluno_id": 0,  # Maria (índice 0)
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
        "aluno_id": 1,  # José (índice 1) 
        "notas": [
            Nota(avaliacao=avaliacoes[0], nota=7),  # Matemática Prova B1
            Nota(avaliacao=avaliacoes[1], nota=8),  # Matemática Trabalho B1
            Nota(avaliacao=avaliacoes[2], nota=6),  # Português Prova B1
            Nota(avaliacao=avaliacoes[3], nota=7),  # Português Trabalho B1
            Nota(avaliacao=avaliacoes[4], nota=8),  # História Prova B1
            Nota(avaliacao=avaliacoes[5], nota=9),  # História Trabalho B1
            Nota(avaliacao=avaliacoes[6], nota=6),  # Geografia Prova B1
            Nota(avaliacao=avaliacoes[7], nota=7),  # Geografia Trabalho B1
            Nota(avaliacao=avaliacoes[8], nota=8),  # Ciências Prova B1
        ]
    },
    {
        "aluno_id": 2,  # Ana (índice 2)
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
        "aluno_id": 3,  # Pedro (índice 3)
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

]