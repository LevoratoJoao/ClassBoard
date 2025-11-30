from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from models.models import Aluno, User
from database.config import get_db
from database.models import AlunoTable
from services.auth import get_current_user
from utils.user_utils import get_user_id_from_db, should_filter_by_user

router = APIRouter()

@router.get("/alunos", response_model=List[Aluno])
def get_alunos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(AlunoTable)
    
    # Se não for admin, filtrar apenas pelos alunos do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(AlunoTable.user_id == user_id)
    
    alunos = query.all()
    return [Aluno(id=a.id, nome=a.nome, sexo=a.sexo) for a in alunos]

@router.get("/alunos/{aluno_id}", response_model=Aluno)
def get_aluno_by_id(aluno_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(AlunoTable).filter(AlunoTable.id == aluno_id)
    
    # Se não for admin, verificar se o aluno pertence ao usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(AlunoTable.user_id == user_id)
    
    aluno = query.first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return Aluno(id=aluno.id, nome=aluno.nome, sexo=aluno.sexo)

@router.get("/alunos/filter", response_model=List[Aluno])
def filter_alunos(sexo: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(AlunoTable)
    
    # Se não for admin, filtrar apenas pelos alunos do usuário
    if should_filter_by_user(current_user):
        user_id = get_user_id_from_db(current_user.username, db)
        query = query.filter(AlunoTable.user_id == user_id)
    
    if sexo and sexo != "All":
        query = query.filter(AlunoTable.sexo.ilike(f"%{sexo}%"))
    alunos = query.all()
    return [Aluno(id=a.id, nome=a.nome, sexo=a.sexo) for a in alunos]

@router.post("/alunos", response_model=Aluno)
def create_aluno(aluno_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = get_user_id_from_db(current_user.username, db)
    new_aluno = AlunoTable(nome=aluno_data["nome"], sexo=aluno_data["sexo"], user_id=user_id)
    db.add(new_aluno)
    db.commit()
    db.refresh(new_aluno)
    return Aluno(id=new_aluno.id, nome=new_aluno.nome, sexo=new_aluno.sexo)
