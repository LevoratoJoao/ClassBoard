from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from models.models import Falta, User
from database.models import FaltaTable, AlunoTable
from database.config import get_db
from services.auth import get_current_user

router = APIRouter()

@router.get("/faltas")
def get_all_faltas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Retorna todas as faltas de todos os alunos"""
    faltas = db.query(FaltaTable).join(AlunoTable).all()
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
    faltas = db.query(FaltaTable).filter(FaltaTable.aluno_id == aluno_id).all()
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
    total = db.query(FaltaTable).filter(FaltaTable.aluno_id == aluno_id).count()
    return {"aluno_id": aluno_id, "total_faltas": total}