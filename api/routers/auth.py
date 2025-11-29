from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from services.auth import authenticate_user, create_access_token, get_current_user, logout_token, oauth2_scheme, ACCESS_TOKEN_EXPIRE_MINUTES, create_user
from models.models import Token, User, UserLogin
from database.models import UserTable
from database.config import get_db

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    logout_token(token)
    return {"message": "Successfully logged out"}

@router.post("/register", response_model=User)
async def register(user_data: UserLogin, db: Session = Depends(get_db)):
    # Verificar se o usuário já existe no banco de dados
    existing_user = db.query(UserTable).filter(UserTable.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    create_user(user_data.username, user_data.password)
    return User(username=user_data.username, is_active=True)
