from fastapi import FastAPI
from routers import alunos, avaliacoes

app = FastAPI()

app.include_router(alunos.router)
app.include_router(avaliacoes.router)