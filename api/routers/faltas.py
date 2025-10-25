from fastapi import APIRouter, HTTPException
from typing import List
from models.models import Falta
from data.faltas import faltas_por_aluno

router = APIRouter()

@router.get("/faltas", response_model=List[dict])
def get_all_faltas():
    """Retorna todas as faltas de todos os alunos"""
    return faltas_por_aluno

@router.get("/faltas/{aluno_id}", response_model=List[dict])
def get_faltas_by_aluno_id(aluno_id: int):
    """Retorna as faltas de um aluno específico"""
    for entry in faltas_por_aluno:
        if entry["aluno_id"] == aluno_id:
            return entry["faltas"]
    return []

@router.get("/faltas/{aluno_id}/total")
def get_total_faltas_by_aluno_id(aluno_id: int):
    """Retorna o total de faltas de um aluno específico"""
    for entry in faltas_por_aluno:
        if entry["aluno_id"] == aluno_id:
            return {"aluno_id": aluno_id, "total_faltas": len(entry["faltas"])}
    return {"aluno_id": aluno_id, "total_faltas": 0}