from collections import defaultdict
from fastapi import APIRouter, HTTPException

from data.turma import turma
from data.alunos import alunos
from data.faltas import faltas_por_aluno
from data.materias import materias
from data.avaliacoes import avaliacoes
import data.notas as notas_data

router = APIRouter(prefix="/turma", tags=["turma"])

_alunos_map = {a.id: a for a in alunos}
_faltas_map = {row["aluno_id"]: row.get("faltas", []) for row in faltas_por_aluno}

avaliacao_para_materia = {}
for av in avaliacoes:
    mat = getattr(av.materia, "value", av.materia)
    avaliacao_para_materia[av.id] = mat

def _iter_notas():
    if hasattr(notas_data, "notas"):
        for item in getattr(notas_data, "notas", []):
            if isinstance(item, dict):
                aluno_id = item.get("aluno_id")
                aval_id  = item.get("avaliacao_id") or (item.get("avaliacao") or {}).get("id")
                nota_val = item.get("nota")
            else:
                aluno_id = getattr(item, "aluno_id", None) or getattr(getattr(item, "aluno", None), "id", None)
                aval     = getattr(item, "avaliacao", None)
                aval_id  = getattr(item, "avaliacao_id", None) or (getattr(aval, "id", None))
                nota_val = getattr(item, "nota", None)
            if aluno_id is None or aval_id is None or nota_val is None:
                continue
            try:
                yield int(aluno_id), int(aval_id), float(nota_val)
            except Exception:
                continue

    if hasattr(notas_data, "notas_por_aluno"):
        for row in getattr(notas_data, "notas_por_aluno", []):
            aluno_id = row.get("aluno_id")
            for nobj in row.get("notas", []):
                if isinstance(nobj, dict):
                    aval_id  = nobj.get("avaliacao_id") or (nobj.get("avaliacao") or {}).get("id")
                    nota_val = nobj.get("nota")
                else:
                    aval     = getattr(nobj, "avaliacao", None)
                    aval_id  = getattr(nobj, "avaliacao_id", None) or getattr(aval, "id", None)
                    nota_val = getattr(nobj, "nota", None)
                if aluno_id is None or aval_id is None or nota_val is None:
                    continue
                try:
                    yield int(aluno_id), int(aval_id), float(nota_val)
                except Exception:
                    continue

agr_notas = defaultdict(lambda: defaultdict(lambda: {"soma": 0.0, "n": 0}))
for aluno_id, aval_id, nota_val in _iter_notas():
    materia_id = avaliacao_para_materia.get(aval_id)
    if not materia_id:
        continue
    agr_notas[aluno_id][materia_id]["soma"] += nota_val
    agr_notas[aluno_id][materia_id]["n"]    += 1

def medias_por_materia_do_aluno(aluno_id: int) -> dict:
    out = {}
    for m in materias:
        mid = m["id"]
        acc = agr_notas[aluno_id].get(mid)
        if acc and acc["n"] > 0:
            out[mid] = acc["soma"] / acc["n"]
    return out

datas_distintas_por_materia = defaultdict(set)
for row in faltas_por_aluno:
    for f in row.get("faltas", []):
        if f.get("tipo") == "Aula":
            datas_distintas_por_materia[f["materia"]].add(f["data"])
total_dias_por_materia = {k: len(v) for k, v in datas_distintas_por_materia.items()}

def frequencia_por_materia_do_aluno(aluno_id: int) -> dict:
    faltas_rows = _faltas_map.get(aluno_id, [])
    cont_faltas = defaultdict(int)
    for f in faltas_rows:
        if f.get("tipo") == "Aula":
            cont_faltas[f["materia"]] += 1

    freq = {}
    for m in materias:
        mid = m["id"]
        total = total_dias_por_materia.get(mid, 0)
        if total <= 0:
            freq[mid] = 1.0
            continue
        presenca = 1.0 - (cont_faltas.get(mid, 0) / total)
        freq[mid] = max(0.0, min(1.0, presenca))
    return freq

@router.get("")
def listar_turma():
    return [{"id": t["id"], "nome": t["nome"], "turno": t["turno"]} for t in turma]

@router.get("/{turma_id}")
def obter_turma(turma_id: int):
    t = next((x for x in turma if x["id"] == turma_id), None)
    if not t:
        raise HTTPException(status_code=404, detail="Turma não encontrada")

    alunos_expand = []
    for aid in t.get("aluno_ids", []):
        a = _alunos_map.get(aid)
        if not a:
            continue

        faltas_objs = _faltas_map.get(aid, [])
        faltas_datas = [f.get("data") for f in faltas_objs if "data" in f]

        alunos_expand.append({
            "id": a.id,
            "nome": a.nome,
            "sexo": a.sexo,
            "notas": medias_por_materia_do_aluno(a.id),
            "frequencia": frequencia_por_materia_do_aluno(a.id),
            "faltas": faltas_datas,
        })

    return {
        "id": t["id"],
        "nome": t["nome"],
        "turno": t["turno"],
        "materias": materias,
        "alunos": alunos_expand,
    }