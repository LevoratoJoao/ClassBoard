from typing import List, Any
from data.notas import notas_por_aluno
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