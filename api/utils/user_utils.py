from sqlalchemy.orm import Session
from database.models import UserTable
from models.models import User

def get_user_id_from_db(username: str, db: Session) -> int:
    """Obtém o ID do usuário no banco de dados pelo username"""
    user = db.query(UserTable).filter(UserTable.username == username).first()
    if user:
        return user.id
    raise ValueError(f"User {username} not found in database")

def is_admin_user(current_user: User) -> bool:
    """Verifica se o usuário atual é admin"""
    return current_user.username == "admin"

def should_filter_by_user(current_user: User) -> bool:
    """Retorna True se devemos filtrar por usuário (não é admin)"""
    return not is_admin_user(current_user)