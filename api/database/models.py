from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database.config import Base
from models.models import Materia
import enum

class AlunoTable(Base):
    __tablename__ = "alunos"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    sexo = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    notas = relationship("NotaTable", back_populates="aluno")
    faltas = relationship("FaltaTable", back_populates="aluno")

class AvaliacaoTable(Base):
    __tablename__ = "avaliacoes"
    
    id = Column(Integer, primary_key=True, index=True)
    materia = Column(SQLEnum(Materia))
    tipo = Column(String)
    bimestre = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    notas = relationship("NotaTable", back_populates="avaliacao")

class NotaTable(Base):
    __tablename__ = "notas"
    
    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("alunos.id"))
    avaliacao_id = Column(Integer, ForeignKey("avaliacoes.id"))
    nota = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    aluno = relationship("AlunoTable", back_populates="notas")
    avaliacao = relationship("AvaliacaoTable", back_populates="notas")

class FaltaTable(Base):
    __tablename__ = "faltas"
    
    id = Column(Integer, primary_key=True, index=True)
    aluno_id = Column(Integer, ForeignKey("alunos.id"))
    data = Column(Date)
    materia = Column(SQLEnum(Materia))
    tipo = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    aluno = relationship("AlunoTable", back_populates="faltas")

class UserTable(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Integer, default=1)

class TurmaTable(Base):
    __tablename__ = "turmas"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    turno = Column(String)
    ano = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
