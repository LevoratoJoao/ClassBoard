from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database.config import get_db
from database.models import TurmaTable, AlunoTable, NotaTable, FaltaTable, AvaliacaoTable
from models.models import Turma, User
from services.auth import get_current_user

router = APIRouter(prefix="/turma", tags=["turma"])

@router.get("")
def listar_turmas(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Lista todas as turmas"""
    turmas = db.query(TurmaTable).all()
    return [
        {
            "id": t.id,
            "nome": t.nome,
            "turno": t.turno,
            "ano": t.ano
        }
        for t in turmas
    ]

@router.get("/{turma_id}")
def obter_turma(turma_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Obtém detalhes de uma turma específica"""
    turma = db.query(TurmaTable).filter(TurmaTable.id == turma_id).first()
    if not turma:
        raise HTTPException(status_code=404, detail="Turma não encontrada")

    # Buscar todos os alunos (simulando que todos pertencem à turma para demo)
    alunos = db.query(AlunoTable).all()
    
    alunos_detalhados = []
    for aluno in alunos:
        # Buscar notas do aluno
        notas = db.query(NotaTable).filter(NotaTable.aluno_id == aluno.id).join(AvaliacaoTable).all()
        
        # Buscar faltas do aluno
        faltas = db.query(FaltaTable).filter(FaltaTable.aluno_id == aluno.id).all()
        
        # Calcular médias por matéria
        notas_por_materia = {}
        for nota in notas:
            materia = nota.avaliacao.materia.value if hasattr(nota.avaliacao.materia, 'value') else str(nota.avaliacao.materia)
            if materia not in notas_por_materia:
                notas_por_materia[materia] = []
            notas_por_materia[materia].append(nota.nota)
        
        medias = {materia: sum(valores) / len(valores) for materia, valores in notas_por_materia.items()}
        
        # Calcular frequência (simplificado)
        total_faltas = len(faltas)
        frequencia = max(0.0, 1.0 - (total_faltas * 0.1))  # Simulação simples
        
        alunos_detalhados.append({
            "id": aluno.id,
            "nome": aluno.nome,
            "sexo": aluno.sexo,
            "notas": medias,
            "frequencia": {"geral": frequencia},
            "faltas": [f.data.isoformat() for f in faltas]
        })

    return {
        "id": turma.id,
        "nome": turma.nome,
        "turno": turma.turno,
        "ano": turma.ano,
        "alunos": alunos_detalhados
    }