from typing import List, Any
from data.notas import notas_por_aluno
from data.alunos import alunos
from models.models import Avaliacao
from models.models import Nota
from data.avaliacoes import avaliacoes

def get_all_notas() -> List[Nota]:
    """Retorna todas as notas de todos os alunos."""
    all_notas_list = []
    # Itera por cada entrada de aluno e coleta todas as suas notas
    for entry in notas_por_aluno:
        all_notas_list.extend(entry["notas"])
    return all_notas_list

def get_notas_by_aluno_id(aluno_id: int) -> List[Nota]:
    """Retorna todas as notas de um aluno específico pelo seu ID."""
    # Busca a entrada do aluno pelo ID
    for entry in notas_por_aluno:
        if entry["aluno_id"] == aluno_id:
            return entry["notas"]
    return []

def filter_notas(**criteria) -> List[Nota]:
    """
    Filtra notas baseado em critérios incluindo ID do aluno e detalhes da avaliação.
    """
    filtered_notas = []
    student_id_filter = criteria.get('aluno_id')

    # Itera pelas notas de cada aluno
    for student_entry in notas_por_aluno:
        current_aluno_id = student_entry.get("aluno_id")

        # Pula se o ID do aluno não corresponde ao filtro
        if student_id_filter is not None and current_aluno_id != student_id_filter:
            continue

        # Verifica cada nota contra os critérios
        for nota in student_entry.get("notas", []):
            matches_evaluation = True

            # Valida cada critério contra a avaliação da nota
            for k, v in criteria.items():
                if k == 'aluno_id':  # Pula ID do aluno pois já foi filtrado
                    continue

                if v is None or v == 'All':  # Pula filtros vazios/todos
                    continue

                # Verifica se a avaliação tem o atributo necessário
                if not hasattr(nota.avaliacao, k):
                    matches_evaluation = False
                    break

                attr_value = getattr(nota.avaliacao, k)
                criteria_value = v

                # Trata conversão de tipo para bimestre
                try:
                    if k == 'bimestre' and isinstance(attr_value, int):
                         criteria_value = int(criteria_value)
                except (ValueError, TypeError):
                    matches_evaluation = False
                    break

                # Verifica se os valores correspondem
                if attr_value != criteria_value:
                    matches_evaluation = False
                    break

            if matches_evaluation:
                filtered_notas.append(nota)

    return filtered_notas

def find_aluno_id_by_name(nome: str) -> Any:
    """
    Encontra o ID do aluno baseado no nome.
    Retorna None se o aluno não for encontrado.
    """
    for i, aluno in enumerate(alunos):
        if aluno.nome == nome:
            return i
    return None

def find_avaliacao_by_id(avaliacao_id: int) -> Any:
    """
    Encontra a avaliação baseada no ID.
    Retorna None se a avaliação não for encontrada.
    """
    for avaliacao in avaliacoes:
        if avaliacao.id == avaliacao_id:
            return avaliacao
    return None

def find_student_entry_by_aluno_id(aluno_id: int) -> Any:
    for entry in notas_por_aluno:
        if entry["aluno_id"] == aluno_id:
            student_entry = entry
            break

def find_existing_nota(student_entry, avaliacao) -> Any:
    for nota in student_entry["notas"]:
        if nota.avaliacao.id == avaliacao.id:
            return nota
    return None

def create_or_update_nota(nota_data):
    """
    Cria ou atualiza uma nota para um aluno baseado nos dados fornecidos.
    """
    # Encontra o ID do aluno pelo nome
    aluno_id = find_aluno_id_by_name(nota_data.aluno_nome)

    if aluno_id is None:
        raise ValueError(f"Aluno '{nota_data.aluno_nome}' não encontrado")

    # Encontra a avaliação pelo ID
    avaliacao = find_avaliacao_by_id(nota_data.avaliacao_id)

    if avaliacao is None:
        raise ValueError(f"Avaliação com ID {nota_data.avaliacao_id} não encontrada")

    # Encontra ou cria entrada do aluno em notas_por_aluno
    student_entry = find_student_entry_by_aluno_id(aluno_id)

    # Cria nova entrada do aluno se não encontrada
    if student_entry is None:
        student_entry = {"aluno_id": aluno_id, "notas": []}
        notas_por_aluno.append(student_entry)

    # Verifica se já existe nota para esta avaliação
    existing_nota = find_existing_nota(student_entry, avaliacao)

    # Atualiza nota existente ou cria nova
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
