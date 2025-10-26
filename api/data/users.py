from models.models import UserInDB

users_db = {
    "admin": UserInDB(
        username="admin",
        hashed_password="admin123",
        is_active=True
    )
}

active_tokens = set()
