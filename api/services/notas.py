from typing import List
from sqlalchemy.orm import Session
from database.models import NotaTable, AlunoTable, AvaliacaoTable
from models.models import Nota, Avaliacao, User
from utils.user_utils import get_user_id_from_db, should_filter_by_user

def get_all_notas(db: Session, current_user: User) -> List[Nota]:
    query = db.query(NotaTable).join(AvaliacaoTable)
    
    # Se não for admin, filtrar apenas pelas notas do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(NotaTable.user_id == user_id)
    
    notas = query.all()
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

def get_notas_by_aluno_id(db: Session, current_user: User, aluno_id: int) -> List[Nota]:
    query = db.query(NotaTable).filter(NotaTable.aluno_id == aluno_id).join(AvaliacaoTable)
    
    # Se não for admin, filtrar apenas pelas notas do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(NotaTable.user_id == user_id)
    
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

def filter_notas(db: Session, current_user: User, **criteria) -> List[Nota]:
    query = db.query(NotaTable).join(AvaliacaoTable)
    
    # Se não for admin, filtrar apenas pelas notas do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(NotaTable.user_id == user_id)
    
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

def create_or_update_nota(nota_data, db: Session, current_user: User):
    user_id = get_user_id_from_db(current_user.username, db)
    
    # Verificar se o aluno pertence ao usuário (ou se é admin)
    aluno_query = db.query(AlunoTable).filter(AlunoTable.nome == nota_data.aluno_nome)
    if should_filter_by_user(current_user):
        aluno_query = aluno_query.filter(AlunoTable.user_id == user_id)
    
    aluno = aluno_query.first()
    if not aluno:
        raise ValueError(f"Aluno '{nota_data.aluno_nome}' não encontrado ou não pertence ao usuário")
    
    # Verificar se a avaliação pertence ao usuário (ou se é admin)
    avaliacao_query = db.query(AvaliacaoTable).filter(AvaliacaoTable.id == nota_data.avaliacao_id)
    if should_filter_by_user(current_user):
        avaliacao_query = avaliacao_query.filter(AvaliacaoTable.user_id == user_id)
    
    avaliacao = avaliacao_query.first()
    if not avaliacao:
        raise ValueError(f"Avaliação com ID {nota_data.avaliacao_id} não encontrada ou não pertence ao usuário")
    
    existing_nota = db.query(NotaTable).filter(
        NotaTable.aluno_id == aluno.id,
        NotaTable.avaliacao_id == avaliacao.id
    ).first()
    
    if existing_nota:
        existing_nota.nota = nota_data.nota
        if not existing_nota.user_id:  # Se for um registro antigo sem user_id
            existing_nota.user_id = user_id
        db.commit()
        return existing_nota
    else:
        new_nota = NotaTable(
            aluno_id=aluno.id,
            avaliacao_id=avaliacao.id,
            nota=nota_data.nota,
            user_id=user_id
        )
        db.add(new_nota)
        db.commit()
        return new_nota
