import { notas } from "../data/notas.js";

const allNotas = notas.flatMap((data) => data.notas);

const getNotaValues = (notaObjs) => notaObjs.map((n) => n.nota);
const calcMedia = (arr) =>
  arr.length ? (arr.reduce((acc, v) => acc + v, 0) / arr.length).toFixed(2) : 0;

const groupBy = (arr, keyFn) =>
  arr.reduce((acc, obj) => {
    const key = keyFn(obj);
    acc[key] = acc[key] || [];
    acc[key].push(obj.nota);
    return acc;
  }, {});

export const getNotasByAluno = (aluno) =>
  getNotaValues(allNotas.filter((notaObj) => notaObj.aluno === aluno));

export const getMediaByAluno = (aluno) => calcMedia(getNotasByAluno(aluno));

export const getNotasByAlunoAndBimestre = (aluno, bimestre) =>
  getNotaValues(
    allNotas.filter(
      (notaObj) =>
        notaObj.aluno === aluno &&
        notaObj.avaliacao.bimestre === Number(bimestre)
    )
  );

export const getMediaByAlunoAndBimestre = (aluno, bimestre) =>
  calcMedia(getNotasByAlunoAndBimestre(aluno, bimestre));

export const getNotasByAlunoAndTipo = (aluno, tipo) =>
  getNotaValues(
    allNotas.filter(
      (notaObj) => notaObj.aluno === aluno && notaObj.avaliacao.tipo === tipo
    )
  );

export const getMediaByAlunoAndTipo = (aluno, tipo) =>
  calcMedia(getNotasByAlunoAndTipo(aluno, tipo));

export const getNotasByAlunoTipoAndBimestre = (aluno, tipo, bimestre) =>
  getNotaValues(
    allNotas.filter(
      (notaObj) =>
        notaObj.aluno === aluno &&
        notaObj.avaliacao.tipo === tipo &&
        notaObj.avaliacao.bimestre === Number(bimestre)
    )
  );

export const getMediaByAlunoTipoAndBimestre = (aluno, tipo, bimestre) =>
  calcMedia(getNotasByAlunoTipoAndBimestre(aluno, tipo, bimestre));

export const getMediaAvaliacaoByAlunoForEachAvaliacao = (aluno) => {
  const filtered = allNotas.filter((notaObj) => notaObj.aluno === aluno);
  const grouped = groupBy(
    filtered,
    (n) => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`
  );
  const result = {};
  for (const key in grouped) result[key] = calcMedia(grouped[key]);
  return result;
};

export const getMediaAvaliacaoByAlunoForEachType = (aluno, tipo) => {
  const filtered = allNotas.filter(
    (notaObj) => notaObj.aluno === aluno && notaObj.avaliacao.tipo === tipo
  );
  const grouped = groupBy(
    filtered,
    (n) => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`
  );
  const result = {};
  for (const key in grouped) result[key] = calcMedia(grouped[key]);
  return result;
};

export const getMediaAvaliacaoByAlunoForEachBimestre = (aluno, bimestre) => {
  const filtered = allNotas.filter(
    (notaObj) =>
      notaObj.aluno === aluno && notaObj.avaliacao.bimestre === Number(bimestre)
  );
  const grouped = groupBy(
    filtered,
    (n) => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`
  );
  const result = {};
  for (const key in grouped) result[key] = calcMedia(grouped[key]);
  return result;
};

export const getMediaAvaliacaoByAlunoForEachTypeAndBimestre = (
  aluno,
  tipo,
  bimestre
) => {
  const filtered = allNotas.filter(
    (notaObj) =>
      notaObj.aluno === aluno &&
      notaObj.avaliacao.tipo === tipo &&
      notaObj.avaliacao.bimestre === Number(bimestre)
  );
  const grouped = groupBy(
    filtered,
    (n) => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`
  );
  const result = {};
  for (const key in grouped) result[key] = calcMedia(grouped[key]);
  return result;
};
