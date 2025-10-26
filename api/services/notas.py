from typing import List, Any
from data.notas import notas_por_aluno
from data.alunos import alunos
from models.models import Avaliacao
from models.models import Nota

def get_all_notas() -> List[Nota]:
    all_notas_list = []
    for entry in notas_por_aluno:
        all_notas_list.extend(entry["notas"])
    return all_notas_list

def get_notas_by_aluno_id(aluno_id: int) -> List[Nota]:
    for entry in notas_por_aluno:
        if entry["aluno_id"] == aluno_id:
            return entry["notas"]
    return []

def filter_notas(**criteria) -> List[Nota]:
    """
    Filters notas based on criteria including student ID and evaluation details.
    """
    filtered_notas = []
    student_id_filter = criteria.get('aluno_id')

    for student_entry in notas_por_aluno:
        current_aluno_id = student_entry.get("aluno_id")

        if student_id_filter is not None and current_aluno_id != student_id_filter:
            continue

        for nota in student_entry.get("notas", []):
            matches_evaluation = True
            for k, v in criteria.items():
                if k == 'aluno_id':
                    continue

                if v is None or v == 'All':
                    continue

                if not hasattr(nota.avaliacao, k):
                    matches_evaluation = False
                    break

                attr_value = getattr(nota.avaliacao, k)
                criteria_value = v

                try:
                    if k == 'bimestre' and isinstance(attr_value, int):
                         criteria_value = int(criteria_value)
                except (ValueError, TypeError):
                    matches_evaluation = False
                    break

                if attr_value != criteria_value:
                    matches_evaluation = False
                    break

            if matches_evaluation:
                filtered_notas.append(nota)

    return filtered_notas

def create_or_update_nota(nota_data):
    """
    Creates or updates a nota for a given aluno based on the provided data.
    """
    aluno_id = None
    for i, aluno in enumerate(alunos):
        if aluno.nome == nota_data.aluno_nome:
            aluno_id = i
            break

    if aluno_id is None:
        raise ValueError(f"Aluno '{nota_data.aluno_nome}' não encontrado")

    from data.avaliacoes import avaliacoes
    avaliacao = None
    for av in avaliacoes:
        if av.id == nota_data.avaliacao_id:
            avaliacao = av
            break

    if avaliacao is None:
        raise ValueError(f"Avaliação com ID {nota_data.avaliacao_id} não encontrada")

    student_entry = None
    for entry in notas_por_aluno:
        if entry["aluno_id"] == aluno_id:
            student_entry = entry
            break

    if student_entry is None:
        student_entry = {"aluno_id": aluno_id, "notas": []}
        notas_por_aluno.append(student_entry)

    existing_nota = None
    for nota in student_entry["notas"]:
        if nota.avaliacao.id == avaliacao.id:
            existing_nota = nota
            break

    if existing_nota:
        existing_nota.nota = int(nota_data.nota)
        return existing_nota
    else:
        new_nota = Nota(
            avaliacao=avaliacao,
            nota=int(nota_data.nota)
        )
        student_entry["notas"].append(new_nota)
        return new_nota

