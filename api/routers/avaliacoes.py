from fastapi import APIRouter, Depends
from typing import List
from models.models import Avaliacao, User
from services import avaliacoes as avaliacoes_service
from services.auth import get_current_user

router = APIRouter()

@router.get("/avaliacoes", response_model=List[Avaliacao])
def get_avaliacoes(current_user: User = Depends(get_current_user)):
    return avaliacoes_service.get_all_avaliacoes()

@router.get("/avaliacoes/filter", response_model=List[Avaliacao])
def filter_avaliacoes(materia: str = None, tipo: str = None, bimestre: int = None, current_user: User = Depends(get_current_user)):
    return avaliacoes_service.get_avaliacoes_by_filters(materia, tipo, bimestre)