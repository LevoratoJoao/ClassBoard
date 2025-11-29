from fastapi import APIRouter, Depends
from models.models import Materia, User
from services.auth import get_current_user

router = APIRouter(prefix="/materias", tags=["materias"])

@router.get("")
def listar_materias(current_user: User = Depends(get_current_user)):
    """Lista todas as matérias disponíveis"""
    return [
        {"id": materia.value, "label": materia.value}
        for materia in Materia
    ]