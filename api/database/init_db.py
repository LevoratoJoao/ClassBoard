from sqlalchemy.orm import Session
from database.config import engine, Base, get_db
from database.models import AlunoTable, AvaliacaoTable, NotaTable, FaltaTable, TurmaTable, UserTable
from models.models import Materia
from passlib.context import CryptContext
from datetime import date

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def init_database():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    with Session(engine) as db:
        existing_alunos = db.query(AlunoTable).count()
        print(f"Existing alunos: {existing_alunos}")
        
        if existing_alunos > 0:
            print("Database already initialized")
            return
            
        print("Inserting data...")
        
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
        print("Basic data inserted, now inserting notas...")
        
        notas_data = [
            NotaTable(aluno_id=1, avaliacao_id=1, nota=8),
            NotaTable(aluno_id=1, avaliacao_id=2, nota=9),
            NotaTable(aluno_id=1, avaliacao_id=3, nota=7),
            NotaTable(aluno_id=2, avaliacao_id=1, nota=9),
            NotaTable(aluno_id=2, avaliacao_id=2, nota=10),
            NotaTable(aluno_id=2, avaliacao_id=3, nota=8),
            NotaTable(aluno_id=3, avaliacao_id=1, nota=7),
            NotaTable(aluno_id=3, avaliacao_id=2, nota=8),
            NotaTable(aluno_id=3, avaliacao_id=3, nota=6),
        ]
        
        db.add_all(notas_data)
        db.commit()
        print("Database initialized successfully!")

def reset_database():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Reinitializing database...")
    init_database()

def debug_database():
    with Session(engine) as db:
        alunos_count = db.query(AlunoTable).count()
        avaliacoes_count = db.query(AvaliacaoTable).count()
        notas_count = db.query(NotaTable).count()
        print(f"Database counts - Alunos: {alunos_count}, Avaliacoes: {avaliacoes_count}, Notas: {notas_count}")
        
        if notas_count > 0:
            print("Sample notas:")
            sample_notas = db.query(NotaTable).limit(3).all()
            for nota in sample_notas:
                print(f"  Aluno {nota.aluno_id}, Avaliacao {nota.avaliacao_id}, Nota {nota.nota}")

if __name__ == "__main__":
    debug_database()
    if input("Reset database? (y/n): ").lower() == 'y':
        reset_database()
        debug_database()
