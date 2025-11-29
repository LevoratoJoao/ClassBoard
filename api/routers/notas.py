from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from models.models import Nota, User
from services import notas as service
from services.auth import get_current_user
from database.config import get_db
from pydantic import BaseModel

router = APIRouter()

class NotaCreate(BaseModel):
    aluno_nome: str
    avaliacao_id: int
    nota: float

@router.get("/notas", response_model=List[Nota])
def get_notas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_all_notas(db, current_user)

@router.post("/notas")
def create_nota(nota_data: NotaCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        service.create_or_update_nota(nota_data, db, current_user)
        return {"message": "Nota criada/atualizada com sucesso"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/notas/filter", response_model=List[Nota])
def filter_notas(materia: str = None, tipo: str = None, bimestre: int = None, aluno_id: int = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    filtered = service.filter_notas(db, current_user, materia=materia, tipo=tipo, bimestre=bimestre, aluno_id=aluno_id)
    return filtered

@router.get("/notas/{aluno_id}", response_model=List[Nota])
def get_notas_by_aluno_id(aluno_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return service.get_notas_by_aluno_id(db, current_user, aluno_id)
