from fastapi import APIRouter
from typing import List
from models.models import Avaliacao
from data.avaliacoes import avaliacoes

router = APIRouter()

@router.get("/avaliacoes", response_model=List[Avaliacao])
def get_avaliacoes():
    return avaliacoes