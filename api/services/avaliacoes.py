from typing import List, Any
from data.avaliacoes import avaliacoes
from models.models import Avaliacao

def get_all_avaliacoes() -> List[Avaliacao]:
    return avaliacoes

def get_avaliacoes_by_filters(materia: Any = None, tipo: Any = None, bimestre: Any = None) -> List[Avaliacao]:
    filtered = avaliacoes
    if materia is not None:
        filtered = [a for a in filtered if a.materia == materia]
    if tipo is not None:
        filtered = [a for a in filtered if a.tipo == tipo]
    if bimestre is not None:
        filtered = [a for a in filtered if a.bimestre == bimestre]
    return filtered