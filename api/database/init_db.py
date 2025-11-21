from sqlalchemy.orm import Session
from database.config import engine, Base
from database.models import AlunoTable, AvaliacaoTable, NotaTable, FaltaTable, TurmaTable, UserTable
from models.models import Materia
from passlib.context import CryptContext
from datetime import date

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def init_database():
    Base.metadata.create_all(bind=engine)
    
    with Session(engine) as db:
        if db.query(AlunoTable).first():
            return
            
        alunos_data = [
            AlunoTable(nome="João", sexo="masculino"),
            AlunoTable(nome="Maria", sexo="feminino"),
            AlunoTable(nome="José", sexo="masculino"),
            AlunoTable(nome="Ana", sexo="feminino"),
            AlunoTable(nome="Pedro", sexo="masculino"),
        ]
        db.add_all(alunos_data)
        
        avaliacoes_data = []
        materias = [Materia.MATEMATICA, Materia.PORTUGUES, Materia.CIENCIAS, Materia.HISTORIA, Materia.GEOGRAFIA, Materia.ARTES]
        tipos = ["Prova", "Trabalho"]
        
        av_id = 1
        for bimestre in range(1, 4):
            for materia in materias:
                for tipo in tipos:
                    avaliacoes_data.append(AvaliacaoTable(
                        id=av_id,
                        materia=materia,
                        tipo=tipo,
                        bimestre=bimestre
                    ))
                    av_id += 1
        
        db.add_all(avaliacoes_data)
        
        turma = TurmaTable(nome="5º Ano A", turno="Manhã", ano=2024)
        db.add(turma)
        
        default_user = UserTable(
            username="admin",
            hashed_password=pwd_context.hash("admin123"),
            is_active=1
        )
        db.add(default_user)
        
        db.commit()
