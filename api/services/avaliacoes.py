from typing import List, Any
from sqlalchemy.orm import Session
from database.models import AvaliacaoTable
from database.config import get_db
from models.models import Avaliacao

def get_all_avaliacoes() -> List[Avaliacao]:
    db = next(get_db())
    try:
        avaliacoes = db.query(AvaliacaoTable).all()
        return [
            Avaliacao(
                id=av.id,
                materia=av.materia,
                tipo=av.tipo,
                bimestre=av.bimestre
            )
            for av in avaliacoes
        ]
    finally:
        db.close()

def get_avaliacoes_by_filters(materia: Any = None, tipo: Any = None, bimestre: Any = None) -> List[Avaliacao]:
    db = next(get_db())
    try:
        query = db.query(AvaliacaoTable)
        
        if materia is not None:
            query = query.filter(AvaliacaoTable.materia == materia)
        if tipo is not None:
            query = query.filter(AvaliacaoTable.tipo == tipo)
        if bimestre is not None:
            query = query.filter(AvaliacaoTable.bimestre == bimestre)
            
        avaliacoes = query.all()
        return [
            Avaliacao(
                id=av.id,
                materia=av.materia,
                tipo=av.tipo,
                bimestre=av.bimestre
            )
            for av in avaliacoes
        ]
    finally:
        db.close()