from fastapi import APIRouter
from typing import List
from models.models import Aluno
from data.alunos import alunos

router = APIRouter()

@router.get("/alunos", response_model=List[Aluno])
def get_alunos():
    return alunos