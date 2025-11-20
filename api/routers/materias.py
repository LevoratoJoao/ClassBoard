from fastapi import APIRouter
from data.materias import materias

router = APIRouter(prefix="/materias", tags=["materias"])

@router.get("")
def listar_materias():
    return materias