from fastapi import APIRouter, Depends
from typing import List
from models.models import Aluno, User
from data.alunos import alunos
from services.auth import get_current_user

router = APIRouter()

@router.get("/alunos", response_model=List[Aluno])
def get_alunos(current_user: User = Depends(get_current_user)):
    return alunos