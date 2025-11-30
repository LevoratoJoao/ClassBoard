from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from data.users import active_tokens
from models.models import TokenData, User, UserInDB
from database.models import UserTable
from database.config import get_db

# Configurações de segurança - ALTERAR EM PRODUÇÃO
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Contexto para hash de senhas usando Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password, stored_password):
    """Verifica se a senha fornecida corresponde à senha armazenada."""
    try:
        # Tenta verificar usando hash seguro
        return pwd_context.verify(plain_password, stored_password)
    except:
        # Fallback para comparação simples (não seguro)
        return plain_password == stored_password

def get_user(username: str, db: Session = None):
    """Busca um usuário no banco de dados pelo nome de usuário."""
    if db is None:
        db = next(get_db())
    
    user_record = db.query(UserTable).filter(UserTable.username == username).first()
    if user_record:
        return UserInDB(
            username=user_record.username,
            hashed_password=user_record.hashed_password,
            is_active=bool(user_record.is_active)
        )
    return None

def authenticate_user(username: str, password: str):
    """Autentica um usuário verificando credenciais."""
    db = next(get_db())
    try:
        user = get_user(username, db)
        # Verifica se usuário existe e senha está correta
        if not user or not verify_password(password, user.hashed_password):
            return False
        return user
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria um token JWT de acesso com tempo de expiração."""
    to_encode = data.copy()
    # Define tempo de expiração (padrão: 15 minutos)
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})

    # Gera o token JWT
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    # Adiciona token à lista de tokens ativos
    active_tokens.add(token)
    return token

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Obtém o usuário atual baseado no token JWT fornecido."""
    # Exceção padrão para credenciais inválidas
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Verifica se o token está na lista de tokens ativos
    if token not in active_tokens:
        raise credentials_exception

    try:
        # Decodifica o token JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        # Token inválido ou expirado
        raise credentials_exception

    # Busca o usuário no banco de dados
    db = next(get_db())
    try:
        user = get_user(username=token_data.username, db=db)
        if user is None:
            raise credentials_exception
        return user
    finally:
        db.close()

def logout_token(token: str):
    """Remove um token da lista de tokens ativos (logout)."""
    active_tokens.discard(token)

def create_user(username: str, password: str) -> UserInDB:
    """Cria um novo usuário com senha hasheada."""
    db = next(get_db())
    try:
        new_user_record = UserTable(
            username=username,
            hashed_password=pwd_context.hash(password),  # Hash seguro da senha
            is_active=1
        )
        db.add(new_user_record)
        db.commit()
        db.refresh(new_user_record)
        
        return UserInDB(
            username=new_user_record.username,
            hashed_password=new_user_record.hashed_password,
            is_active=bool(new_user_record.is_active)
        )
    finally:
        db.close()
