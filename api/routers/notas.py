from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.models import Nota, User
from data.alunos import alunos
from services import notas as service
from services.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class NotaCreate(BaseModel):
    aluno_nome: str
    avaliacao_id: int
    nota: float

@router.get("/notas", response_model=List[Nota])
def get_notas(current_user: User = Depends(get_current_user)):
    return service.get_all_notas()

@router.post("/notas")
def create_nota(nota_data: NotaCreate, current_user: User = Depends(get_current_user)):
    try:
        service.create_or_update_nota(nota_data)
        return {"message": "Nota criada/atualizada com sucesso"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/notas/filter", response_model=List[Nota])
def filter_notas(materia: str = None, tipo: str = None, bimestre: int = None, aluno_id: int = None, current_user: User = Depends(get_current_user)):
    filtered = service.filter_notas(materia=materia, tipo=tipo, bimestre=bimestre, aluno_id=aluno_id)
    return filtered

@router.get("/notas/{aluno_id}", response_model=List[Nota])
def get_notas_by_aluno_id(aluno_id: int, current_user: User = Depends(get_current_user)):
    return service.get_notas_by_aluno_id(aluno_id)
