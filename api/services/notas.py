from typing import List
from sqlalchemy.orm import Session
from database.models import NotaTable, AlunoTable, AvaliacaoTable
from models.models import Nota, Avaliacao
from database.config import get_db

def get_all_notas() -> List[Nota]:
    # Use a context manager to properly handle the session
    db = next(get_db())
    try:
        notas = db.query(NotaTable).join(AvaliacaoTable).all()
        print("Get all notas:", len(notas))
        return [
            Nota(
                avaliacao=Avaliacao(
                    id=nota.avaliacao.id,
                    materia=nota.avaliacao.materia,
                    tipo=nota.avaliacao.tipo,
                    bimestre=nota.avaliacao.bimestre
                ),
                nota=int(nota.nota)
            )
            for nota in notas
        ]
    finally:
        db.close()

def get_notas_by_aluno_id(aluno_id: int) -> List[Nota]:
    db = next(get_db())
    try:
        notas = db.query(NotaTable).filter(NotaTable.aluno_id == aluno_id).join(AvaliacaoTable).all()
        return [
            Nota(
                avaliacao=Avaliacao(
                    id=nota.avaliacao.id,
                    materia=nota.avaliacao.materia,
                    tipo=nota.avaliacao.tipo,
                    bimestre=nota.avaliacao.bimestre
                ),
                nota=int(nota.nota)
            )
            for nota in notas
        ]
    finally:
        db.close()

def filter_notas(**criteria) -> List[Nota]:
    db = next(get_db())
    try:
        query = db.query(NotaTable).join(AvaliacaoTable)
        
        if criteria.get('aluno_id'):
            query = query.filter(NotaTable.aluno_id == criteria['aluno_id'])
        if criteria.get('materia'):
            query = query.filter(AvaliacaoTable.materia == criteria['materia'])
        if criteria.get('tipo'):
            query = query.filter(AvaliacaoTable.tipo == criteria['tipo'])
        if criteria.get('bimestre'):
            query = query.filter(AvaliacaoTable.bimestre == criteria['bimestre'])
        
        notas = query.all()
        return [
            Nota(
                avaliacao=Avaliacao(
                    id=nota.avaliacao.id,
                    materia=nota.avaliacao.materia,
                    tipo=nota.avaliacao.tipo,
                    bimestre=nota.avaliacao.bimestre
                ),
                nota=int(nota.nota)
            )
            for nota in notas
        ]
    finally:
        db.close()

def create_or_update_nota(nota_data, db: Session):
    aluno = db.query(AlunoTable).filter(AlunoTable.nome == nota_data.aluno_nome).first()
    if not aluno:
        raise ValueError(f"Aluno '{nota_data.aluno_nome}' não encontrado")
    
    avaliacao = db.query(AvaliacaoTable).filter(AvaliacaoTable.id == nota_data.avaliacao_id).first()
    if not avaliacao:
        raise ValueError(f"Avaliação com ID {nota_data.avaliacao_id} não encontrada")
    
    existing_nota = db.query(NotaTable).filter(
        NotaTable.aluno_id == aluno.id,
        NotaTable.avaliacao_id == avaliacao.id
    ).first()
    
    if existing_nota:
        existing_nota.nota = nota_data.nota
        db.commit()
        return existing_nota
    else:
        new_nota = NotaTable(
            aluno_id=aluno.id,
            avaliacao_id=avaliacao.id,
            nota=nota_data.nota
        )
        db.add(new_nota)
        db.commit()
        return new_nota
