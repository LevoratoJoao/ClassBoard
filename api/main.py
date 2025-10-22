from fastapi import FastAPI
from routers import alunos, avaliacoes, notas
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alunos.router)
app.include_router(avaliacoes.router)
app.include_router(notas.router)