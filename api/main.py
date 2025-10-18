from fastapi import FastAPI
from routers import alunos, avaliacoes, notas

app = FastAPI()

app.include_router(alunos.router)
app.include_router(avaliacoes.router)
app.include_router(notas.router)