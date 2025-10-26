from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.models import Aluno, User
from data.alunos import alunos
from services.auth import get_current_user

router = APIRouter()

@router.get("/alunos", response_model=List[Aluno])
def get_alunos(current_user: User = Depends(get_current_user)):
    return alunos

@router.get("/alunos/{aluno_id}", response_model=Aluno)
def get_aluno_by_id(aluno_id: int):
    if aluno_id < 0 or aluno_id >= len(alunos):
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return alunos[aluno_id]

@router.get("/alunos/filter", response_model=List[Aluno])
def filter_alunos(sexo: str = None):
    filtered = alunos
    if sexo and sexo != "All":
        filtered = [a for a in filtered if a.sexo.lower() == sexo.lower()]
    return filtered