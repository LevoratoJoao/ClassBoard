import os
from dotenv import load_dotenv
from fastapi import FastAPI
from routers import alunos, avaliacoes, notas, faltas, auth
from fastapi.middleware.cors import CORSMiddleware

# Carregar variáveis de ambiente
load_dotenv()

app = FastAPI(
    title="ClassBoard API",
    description="API para gerenciamento de dados educacionais do ClassBoard",
    version="1.0.0"
)

# Configurar CORS baseado nas variáveis de ambiente
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(alunos.router)
app.include_router(avaliacoes.router)
app.include_router(notas.router)
app.include_router(faltas.router)