from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from models.models import Avaliacao, User
from services import avaliacoes as avaliacoes_service
from services.auth import get_current_user
from database.config import get_db

router = APIRouter()

@router.get("/avaliacoes", response_model=List[Avaliacao])
def get_avaliacoes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return avaliacoes_service.get_all_avaliacoes(db, current_user)

@router.get("/avaliacoes/filter", response_model=List[Avaliacao])
def filter_avaliacoes(materia: str = None, tipo: str = None, bimestre: int = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return avaliacoes_service.get_avaliacoes_by_filters(db, current_user, materia, tipo, bimestre)