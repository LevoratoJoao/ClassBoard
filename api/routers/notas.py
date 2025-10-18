from fastapi import APIRouter
from typing import List
from models.models import Nota
from data.alunos import alunos
from services import notas as service

router = APIRouter()

@router.get("/notas", response_model=List[Nota])
def get_notas():
    return service.get_all_notas()

@router.get("/notas/filter", response_model=List[Nota])
def filter_notas(materia: str = None, tipo: str = None, bimestre: int = None, aluno_id: int = None):
    filtered = service.filter_notas(materia=materia, tipo=tipo, bimestre=bimestre, aluno_id=aluno_id)
    return filtered

@router.get("/notas/{aluno_id}", response_model=List[Nota])
def get_notas_by_aluno_id(aluno_id: int):
    return service.get_notas_by_aluno_id(aluno_id)
