from typing import List, Any
from sqlalchemy.orm import Session
from database.models import AvaliacaoTable
from models.models import Avaliacao, User
from utils.user_utils import get_user_id_from_db, should_filter_by_user

def get_all_avaliacoes(db: Session, current_user: User) -> List[Avaliacao]:
    query = db.query(AvaliacaoTable)
    
    # Se não for admin, filtrar apenas pelas avaliações do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(AvaliacaoTable.user_id == user_id)
    
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

def get_avaliacoes_by_filters(db: Session, current_user: User, materia: Any = None, tipo: Any = None, bimestre: Any = None) -> List[Avaliacao]:
    query = db.query(AvaliacaoTable)
    
    # Se não for admin, filtrar apenas pelas avaliações do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(AvaliacaoTable.user_id == user_id)
    
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