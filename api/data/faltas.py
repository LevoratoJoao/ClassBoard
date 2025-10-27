from models.models import Falta

faltas_por_aluno = [
    {
        "aluno_id": 0,  # Maria
        "faltas": [
            {"data": "2024-02-28", "materia": "Ciencias", "tipo": "Aula"},
            {"data": "2024-03-25", "materia": "Geografia", "tipo": "Aula"},
        ]
    },
    {
        "aluno_id": 1,  # José
        "faltas": [
            {"data": "2024-01-15", "materia": "Matematica", "tipo": "Aula"},
            {"data": "2024-02-10", "materia": "Portugues", "tipo": "Aula"},
            {"data": "2024-03-05", "materia": "Historia", "tipo": "Aula"},
            {"data": "2024-04-12", "materia": "Geografia", "tipo": "Prova"},
            {"data": "2024-05-08", "materia": "Ciencias", "tipo": "Aula"},
        ]
    },
    {
        "aluno_id": 2,  # Ana
        "faltas": [
            {"data": "2024-03-20", "materia": "Artes", "tipo": "Aula"},
        ]
    },
    {
        "aluno_id": 3,  # Pedro
        "faltas": [
            {"data": "2024-02-14", "materia": "Matematica", "tipo": "Aula"},
            {"data": "2024-04-18", "materia": "Historia", "tipo": "Aula"},
            {"data": "2024-05-22", "materia": "Geografia", "tipo": "Aula"},
            {"data": "2024-06-05", "materia": "Ciencias", "tipo": "Prova"},
        ]
    },
]