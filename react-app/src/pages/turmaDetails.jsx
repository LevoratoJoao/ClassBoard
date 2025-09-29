import React, { useMemo } from "react";
import Navbar from "./navbar";
import { getTurma, getMaterias } from "../services/turmaService";
import detalhesFooter from "../assets/images/detalhes.webp";

const NOTA_BAIXA = 6.0;

function media(arr) {
  if (!arr?.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function ajustarPercentuaisQuatroCategorias(a, b, c, d) {
  const soma3 = Math.round(a) + Math.round(b) + Math.round(c);
  const ultimo = Math.max(0, 100 - soma3);
  return [Math.round(a), Math.round(b), Math.round(c), ultimo];
}

const TurmaDetails = () => {
  const turma = useMemo(() => getTurma(), []);
  const materias = useMemo(() => getMaterias(), []);

  const mediaNotasPorMateria = useMemo(() => {
    const out = {};
    materias.forEach(({ id }) => {
      const notas = turma.alunos
        .map((a) => a.notas[id])
        .filter((v) => typeof v === "number");
      out[id] = media(notas);
    });
    return out;
  }, [materias, turma]);

  const { freqPorMateria, freqGeral } = useMemo(() => {
    const porMateria = {};
    const all = [];
    materias.forEach(({ id }) => {
      const vals = turma.alunos
        .map((a) => a.frequencia[id])
        .filter((v) => typeof v === "number");
      porMateria[id] = media(vals);
      all.push(...vals);
    });
    return { freqPorMateria: porMateria, freqGeral: media(all) };
  }, [materias, turma]);

  const topDiasFaltas = useMemo(() => {
    const count = new Map();
    turma.alunos.forEach((a) => (a.faltas || []).forEach((d) => count.set(d, (count.get(d) || 0) + 1)));
    return Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [turma]);

  const relacaoMaterias = useMemo(() => {
    const out = [];

    for (let i = 0; i < materias.length; i++) {
      for (let j = i + 1; j < materias.length; j++) {
        const A = materias[i].id;
        const B = materias[j].id;
        const labelA = materias[i].label;
        const labelB = materias[j].label;

        let n = 0;
        let bothGood = 0;
        let bothBad = 0;
        let onlyABad = 0;
        let onlyBBad = 0;

        turma.alunos.forEach((al) => {
          const na = al.notas[A];
          const nb = al.notas[B];
          if (typeof na !== "number" || typeof nb !== "number") return;

          n++;
          const aBad = na < NOTA_BAIXA;
          const bBad = nb < NOTA_BAIXA;

          if (!aBad && !bBad) bothGood++;
          else if (aBad && bBad) bothBad++;
          else if (aBad && !bBad) onlyABad++;
          else if (!aBad && bBad) onlyBBad++;
        });

        const denom = n || 1;
        const pBothGood = (bothGood / denom) * 100;
        const pBothBad = (bothBad / denom) * 100;
        const pOnlyABad = (onlyABad / denom) * 100;
        const pOnlyBBad = (onlyBBad / denom) * 100;

        const [PBG, PBB, POA, POB] = ajustarPercentuaisQuatroCategorias(
          pBothGood,
          pBothBad,
          pOnlyABad,
          pOnlyBBad
        );

        out.push({
          A,
          B,
          labelA,
          labelB,
          n,
          bothGoodPct: PBG,
          bothBadPct: PBB,
          onlyABadPct: POA,
          onlyBBadPct: POB,
        });
      }
    }

    return out;
  }, [materias, turma]);

  return (
    <>
      <div className="bg-fundo"></div>
      <Navbar />

      <div className="container mt-5">
        <h1 className="mb-4 text-center montserrat-bold">{turma?.nome ?? "Turma"}</h1>

        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="text-muted" style={{ fontSize: ".875rem" }}>
                  Frequência geral
                </div>
                <div className="fs-4 fw-bold">{(freqGeral * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="text-muted" style={{ fontSize: ".875rem" }}>
                  Matérias
                </div>
                <div className="fs-4 fw-bold">{materias.length}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="text-muted" style={{ fontSize: ".875rem" }}>
                  Alunos
                </div>
                <div className="fs-4 fw-bold">{turma.alunos.length}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="text-muted" style={{ fontSize: ".875rem" }}>
                  Dias com faltas (top 5)
                </div>
                <div className="fs-4 fw-bold">{topDiasFaltas.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Nota média da turma em cada matéria</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0">
                <thead>
                  <tr>
                    <th className="montserrat" style={{ fontWeight: 500 }}>
                      Matéria
                    </th>
                    <th className="montserrat text-end" style={{ fontWeight: 500 }}>
                      Média
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {materias.map(({ id, label }) => (
                    <tr key={id}>
                      <td>{label}</td>
                      <td className="text-end">{mediaNotasPorMateria[id].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Frequência média</h5>
            <p className="mb-2">
              <strong>Frequência média geral:</strong> {(freqGeral * 100).toFixed(1)}%
            </p>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0">
                <thead>
                  <tr>
                    <th className="montserrat" style={{ fontWeight: 500 }}>
                      Matéria
                    </th>
                    <th className="montserrat text-end" style={{ fontWeight: 500 }}>
                      Frequência média
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {materias.map(({ id, label }) => (
                    <tr key={id}>
                      <td>{label}</td>
                      <td className="text-end">{(freqPorMateria[id] * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Dias com mais faltas</h5>
            {topDiasFaltas.length === 0 ? (
              <p className="text-muted mb-0">Nenhuma falta registrada.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-sm mb-0">
                  <thead>
                    <tr>
                      <th className="montserrat" style={{ fontWeight: 500 }}>
                        Data
                      </th>
                      <th className="montserrat text-end" style={{ fontWeight: 500 }}>
                        Faltas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDiasFaltas.map(([data, qtd]) => (
                      <tr key={data}>
                        <td>{data}</td>
                        <td className="text-end">{qtd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card mb-5">
          <div className="card-body">
            <h5 className="card-title">Relação entre matérias</h5>
            <p className="mb-2">
              <small>
                Para cada par (A ↔ B), % de alunos que: <strong>vão bem nas duas</strong>,{" "}
                <strong>vão mal nas duas</strong>, <strong>vão mal só em A</strong> e{" "}
                <strong>vão mal só em B</strong> (corte: nota &lt; {NOTA_BAIXA}).
              </small>
            </p>
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0">
                <thead>
                  <tr>
                    <th className="montserrat" style={{ fontWeight: 500 }}>
                      Par
                    </th>
                    <th className="montserrat text-end" style={{ fontWeight: 500 }}>
                      Bem nas duas
                    </th>
                    <th className="montserrat text-end" style={{ fontWeight: 500 }}>
                      Mal nas duas
                    </th>
                    <th className="montserrat text-end" style={{ fontWeight: 500 }}>
                      Mal só em A
                    </th>
                    <th className="montserrat text-end" style={{ fontWeight: 500 }}>
                      Mal só em B
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {relacaoMaterias.map(
                    ({ A, B, labelA, labelB, bothGoodPct, bothBadPct, onlyABadPct, onlyBBadPct, n }) => (
                      <tr key={`${A}-${B}`}>
                        <td>
                          {labelA} ↔ {labelB}{" "}
                          <small className="text-muted">({n} alunos)</small>
                        </td>
                        <td className="text-end">{bothGoodPct}%</td>
                        <td className="text-end">{bothBadPct}%</td>
                        <td className="text-end">
                          {onlyABadPct}% <small className="text-muted">(só {labelA})</small>
                        </td>
                        <td className="text-end">
                          {onlyBBadPct}% <small className="text-muted">(só {labelB})</small>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-4" style={{ background: "transparent" }}>
        <img
          src={detalhesFooter}
          alt="Detalhes"
          style={{ height: "250px", width: "250px", objectFit: "contain", marginTop: 0 }}
        />
      </footer>
    </>
  );
};

export default TurmaDetails;