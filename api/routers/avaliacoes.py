from fastapi import APIRouter
from typing import List
from models.models import Avaliacao
from data.avaliacoes import avaliacoes
from services import avaliacoes as avaliacoes_service

router = APIRouter()

@router.get("/avaliacoes", response_model=List[Avaliacao])
def get_avaliacoes():
    return avaliacoes_service.get_all_avaliacoes()

@router.get("/avaliacoes/filter", response_model=List[Avaliacao])
def filter_avaliacoes(materia: str = None, tipo: str = None, bimestre: int = None):
    return avaliacoes_service.get_avaliacoes_by_filters(materia, tipo, bimestre)