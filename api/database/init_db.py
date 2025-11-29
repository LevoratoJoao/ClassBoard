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
        
        # Primeiro, criar o usuário admin
        default_user = UserTable(
            username="admin",
            hashed_password=pwd_context.hash("admin123"),
            is_active=1
        )
        db.add(default_user)
        db.commit()  # Commit para obter o ID do usuário admin
        db.refresh(default_user)
        
        admin_user_id = default_user.id
        
        alunos_data = [
            AlunoTable(nome="João", sexo="masculino", user_id=admin_user_id),
            AlunoTable(nome="Maria", sexo="feminino", user_id=admin_user_id),
            AlunoTable(nome="José", sexo="masculino", user_id=admin_user_id),
            AlunoTable(nome="Ana", sexo="feminino", user_id=admin_user_id),
            AlunoTable(nome="Pedro", sexo="masculino", user_id=admin_user_id),
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
                        bimestre=bimestre,
                        user_id=admin_user_id
                    ))
                    av_id += 1
        
        db.add_all(avaliacoes_data)
        
        turma = TurmaTable(nome="5º Ano A", turno="Manhã", ano=2024, user_id=admin_user_id)
        db.add(turma)
        
        db.commit()
        print("Basic data inserted, now inserting notas...")
        
        notas_data = [
            NotaTable(aluno_id=1, avaliacao_id=1, nota=8, user_id=admin_user_id),
            NotaTable(aluno_id=1, avaliacao_id=2, nota=9, user_id=admin_user_id),
            NotaTable(aluno_id=1, avaliacao_id=3, nota=7, user_id=admin_user_id),
            NotaTable(aluno_id=2, avaliacao_id=1, nota=9, user_id=admin_user_id),
            NotaTable(aluno_id=2, avaliacao_id=2, nota=10, user_id=admin_user_id),
            NotaTable(aluno_id=2, avaliacao_id=3, nota=8, user_id=admin_user_id),
            NotaTable(aluno_id=3, avaliacao_id=1, nota=7, user_id=admin_user_id),
            NotaTable(aluno_id=3, avaliacao_id=2, nota=8, user_id=admin_user_id),
            NotaTable(aluno_id=3, avaliacao_id=3, nota=6, user_id=admin_user_id),
        ]
        
        db.add_all(notas_data)
        
        print("Inserting faltas...")
        faltas_data = [
            FaltaTable(aluno_id=1, data=date(2024, 3, 15), materia=Materia.MATEMATICA, tipo="Aula", user_id=admin_user_id),
            FaltaTable(aluno_id=1, data=date(2024, 3, 20), materia=Materia.PORTUGUES, tipo="Aula", user_id=admin_user_id),
            FaltaTable(aluno_id=2, data=date(2024, 3, 18), materia=Materia.CIENCIAS, tipo="Aula", user_id=admin_user_id),
            FaltaTable(aluno_id=3, data=date(2024, 3, 22), materia=Materia.HISTORIA, tipo="Aula", user_id=admin_user_id),
            FaltaTable(aluno_id=3, data=date(2024, 4, 5), materia=Materia.MATEMATICA, tipo="Aula", user_id=admin_user_id),
        ]
        
        db.add_all(faltas_data)
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
