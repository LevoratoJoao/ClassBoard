from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from models.models import Falta, User
from database.models import FaltaTable, AlunoTable
from database.config import get_db
from services.auth import get_current_user
from utils.user_utils import get_user_id_from_db, should_filter_by_user

router = APIRouter()

@router.get("/faltas")
def get_all_faltas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retorna todas as faltas de todos os alunos"""
    query = db.query(FaltaTable).join(AlunoTable)
    
    # Se não for admin, filtrar apenas pelas faltas do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(FaltaTable.user_id == user_id)
    
    faltas = query.all()
    return [
        {
            "id": f.id,
            "aluno_id": f.aluno_id,
            "aluno_nome": f.aluno.nome,
            "data": f.data.isoformat(),
            "materia": f.materia.value if hasattr(f.materia, 'value') else f.materia,
            "tipo": f.tipo
        }
        for f in faltas
    ]

@router.get("/faltas/{aluno_id}")
def get_faltas_by_aluno_id(aluno_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retorna as faltas de um aluno específico"""
    query = db.query(FaltaTable).filter(FaltaTable.aluno_id == aluno_id)
    
    # Se não for admin, filtrar apenas pelas faltas do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(FaltaTable.user_id == user_id)
    
    faltas = query.all()
    return [
        {
            "id": f.id,
            "data": f.data.isoformat(),
            "materia": f.materia.value if hasattr(f.materia, 'value') else f.materia,
            "tipo": f.tipo
        }
        for f in faltas
    ]

@router.get("/faltas/{aluno_id}/total")
def get_total_faltas_by_aluno_id(aluno_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retorna o total de faltas de um aluno específico"""
    query = db.query(FaltaTable).filter(FaltaTable.aluno_id == aluno_id)
    
    # Se não for admin, filtrar apenas pelas faltas do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(FaltaTable.user_id == user_id)
    
    total = query.count()
    return {"aluno_id": aluno_id, "total_faltas": total}