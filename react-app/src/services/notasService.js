import { notas } from "../data/notas.js";
import { alunos } from "../data/alunos.js";

const allNotas = notas.flatMap((data) => data.notas);

const filterNotasByAvaliacoes = (criteria = {}) =>
  allNotas.filter((notaObj) =>
    Object.entries(criteria).every(
      ([key, value]) => notaObj.avaliacao[key] === value
    )
  );

const getNotaValues = (notaObjs) => notaObjs.map((n) => n.nota);

export const calcMedia = (arr) =>
  arr.length ? (arr.reduce((acc, v) => acc + v, 0) / arr.length).toFixed(2) : null;

const groupBy = (arr, keyFn) =>
  arr.reduce((acc, obj) => {
    const key = keyFn(obj);
    acc[key] = acc[key] || [];
    acc[key].push(obj.nota);
    return acc;
  }, {});

const groupAndCalcMedia = (arr, keyFn) => {
  const grouped = groupBy(arr, keyFn);
  const result = {};
  for (const key in grouped) result[key] = calcMedia(grouped[key]);
  return result;
};

const filterNotasByAlunoAndAvaliacoes = (alunoNome, criteria = {}) => {
  const notasAluno = findNotasAluno(alunoNome);
  return notasAluno.notas.filter((notaObj) =>
    Object.entries(criteria).every(
      ([key, value]) => notaObj.avaliacao[key] === value
    )
  );
};

const getNotasByAlunoAndCriteria = (alunoNome, criteria) =>
  filterNotasByAlunoAndAvaliacoes(alunoNome, criteria).map((n) => n.nota);

export const getAllNotas = () => allNotas;

export const getNotasByMateria = (materia) =>
  getNotaValues(filterNotasByAvaliacoes({ materia }));

export const getMediaByMateria = (materia) =>
  calcMedia(getNotasByMateria(materia));

export const getNotasByMateriaAndBimestre = (materia, bimestre) =>
  getNotaValues(
    filterNotasByAvaliacoes({ materia, bimestre: Number(bimestre) })
  );

export const getMediaByMateriaAndBimestre = (materia, bimestre) =>
  calcMedia(getNotasByMateriaAndBimestre(materia, bimestre));

export const getNotasByMateriaAndTipo = (materia, tipo) =>
  getNotaValues(filterNotasByAvaliacoes({ materia, tipo }));

export const getMediaByMateriaAndTipo = (materia, tipo) =>
  calcMedia(getNotasByMateriaAndTipo(materia, tipo));

export const getNotasByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
  getNotaValues(
    filterNotasByAvaliacoes({
      ...(materia && { materia }),
      ...(tipo && { tipo }),
      ...(bimestre && { bimestre: Number(bimestre) }),
    })
  );

export const getMediaByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
  calcMedia(getNotasByMateriaTipoAndBimestre(materia, tipo, bimestre));

export const getMediaAvaliacaoByMateriaForEachAvaliacao = (materia) =>
  groupAndCalcMedia(
    filterNotasByAvaliacoes({ materia }),
    (n) => `Bimestre ${n.avaliacao.bimestre}`
  );

export const getMediaAvaliacaoByMateriaForEachTipoAndBimestre = (
  materia,
  tipo,
  bimestre
) =>
  groupAndCalcMedia(
    filterNotasByAvaliacoes({ materia, tipo, bimestre: Number(bimestre) }),
    (n) => `Bimestre ${n.avaliacao.bimestre}`
  );

export const getMediaAvaliacaoForEachMateria = () =>
  groupAndCalcMedia(allNotas, (n) => n.avaliacao.materia);

export const getMediaAvaliacaoByBimestreForEachMateria = (bimestre) =>
  groupAndCalcMedia(
    filterNotasByAvaliacoes({ bimestre: Number(bimestre) }),
    (n) => n.avaliacao.materia
  );

export const getMediaAvaliacaoByTipoForEachMateria = (tipo) =>
  groupAndCalcMedia(
    filterNotasByAvaliacoes({ tipo }),
    (n) => n.avaliacao.materia
  );

export const getMediaAvaliacaoByTipoAndBimestreForEachMateria = (
  tipo,
  bimestre
) =>
  groupAndCalcMedia(
    filterNotasByAvaliacoes({ tipo, bimestre: Number(bimestre) }),
    (n) => n.avaliacao.materia
  );

export const getMediaForEachMateria = () => {
  const materias = [...new Set(allNotas.map((n) => n.avaliacao.materia))];
  return materias.map((materia) => ({
    materia,
    media: getMediaByMateria(materia),
  }));
};

export const findNotasAluno = (alunoNome) =>
  notas.find((n) => n.aluno === alunoNome) || { aluno: alunoNome, notas: [] };

export const getNotasAlunoValues = (alunoNome) =>
  findNotasAluno(alunoNome).notas.map((n) => n.nota);

export const getNotasByAluno = (alunoNome) => findNotasAluno(alunoNome);

export const getMediaByAluno = (alunoNome) =>
  calcMedia(getNotasAlunoValues(alunoNome));

export const getNotasByAlunoAndMateria = (alunoNome, materia) =>
  getNotasByAlunoAndCriteria(alunoNome, { materia });

export const getNotasByAlunoBimestreAndTipo = (alunoNome, bimestre, tipo) =>
  getNotasByAlunoAndCriteria(alunoNome, { bimestre: Number(bimestre), tipo });

export const getMediaByAlunoBimestreAndTipo = (alunoNome, bimestre, tipo) =>
  calcMedia(getNotasByAlunoBimestreAndTipo(alunoNome, bimestre, tipo));

export const getNotasByAlunoAndBimestre = (alunoNome, bimestre) =>
  getNotasByAlunoAndCriteria(alunoNome, { bimestre: Number(bimestre) });

export const getMediaByAlunoAndBimestre = (alunoNome, bimestre) =>
  calcMedia(getNotasByAlunoAndBimestre(alunoNome, bimestre));

export const getNotasByAlunoAndTipo = (alunoNome, tipo) =>
  getNotasByAlunoAndCriteria(alunoNome, { tipo });

export const getMediaByAlunoAndTipo = (alunoNome, tipo) =>
  calcMedia(getNotasByAlunoAndTipo(alunoNome, tipo));

export const getMediaByAlunoAndMateria = (alunoNome, materia) =>
  calcMedia(getNotasByAlunoAndMateria(alunoNome, materia));

export const getNotasByAlunoMateriaAndBimestre = (
  alunoNome,
  materia,
  bimestre
) =>
  getNotasByAlunoAndCriteria(alunoNome, {
    materia,
    bimestre: Number(bimestre),
  });

export const getMediaByAlunoMateriaAndBimestre = (
  alunoNome,
  materia,
  bimestre
) => calcMedia(getNotasByAlunoMateriaAndBimestre(alunoNome, materia, bimestre));

export const getNotasByAlunoMateriaAndTipo = (alunoNome, materia, tipo) =>
  getNotasByAlunoAndCriteria(alunoNome, { materia, tipo });

export const getMediaByAlunoMateriaAndTipo = (alunoNome, materia, tipo) =>
  calcMedia(getNotasByAlunoMateriaAndTipo(alunoNome, materia, tipo));

export const getNotasByAlunoMateriaTipoAndBimestre = (
  alunoNome,
  materia,
  tipo,
  bimestre
) =>
  getNotasByAlunoAndCriteria(alunoNome, {
    materia,
    tipo,
    bimestre: Number(bimestre),
  });

export const getMediaByAlunoMateriaTipoAndBimestre = (
  alunoNome,
  materia,
  tipo,
  bimestre
) =>
  calcMedia(
    getNotasByAlunoMateriaTipoAndBimestre(alunoNome, materia, tipo, bimestre)
  );

export const getMediaByAlunoForEachMateria = (alunoNome) =>
  groupAndCalcMedia(
    findNotasAluno(alunoNome).notas,
    (n) => n.avaliacao.materia
  );

export const getMediaForEachAluno = () =>
  alunos.map((aluno) => ({
    aluno: aluno.nome,
    media: getMediaByAluno(aluno.nome),
  }));

export const getMediaByAlunoForEachMateriaAndBimestre = (alunoNome) => {
  const notasAluno = findNotasAluno(alunoNome).notas;
  const grouped = groupBy(
    notasAluno,
    (n) => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`
  );
  const materias = {};
  Object.keys(grouped).forEach((key) => {
    const [materia, bimestre] = key.split("|");
    if (!materias[materia]) materias[materia] = {};
    materias[materia][bimestre] = calcMedia(grouped[key]);
  });
  return Object.entries(materias).map(([materia, notas]) => ({
    materia,
    notas,
  }));
};

export const getMediaByAlunoAndTipoForEachMateriaAndBimestre = (
  alunoNome,
  tipo
) => {
  const filtered = filterNotasByAlunoAndAvaliacoes(alunoNome, { tipo });
  const grouped = groupBy(
    filtered,
    (n) => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`
  );
  const materias = {};
  Object.keys(grouped).forEach((key) => {
    const [materia, bimestre] = key.split("|");
    if (!materias[materia]) materias[materia] = {};
    materias[materia][bimestre] = calcMedia(grouped[key]);
  });
  return Object.entries(materias).map(([materia, notas]) => ({
    materia,
    notas,
  }));
};

export const getMediaByAlunoAndMateriaForEachBimestre = (
  alunoNome,
  materia
) => {
  const notasAluno = findNotasAluno(alunoNome).notas;
  const grouped = groupBy(
    notasAluno,
    (n) => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`
  );
  const materias = {};
  Object.keys(grouped).forEach((key) => {
    const [mat, bimestre] = key.split("|");
    if (mat === materia) {
      if (!materias[mat]) materias[mat] = {};
      materias[mat][bimestre] = calcMedia(grouped[key]);
    }
  });
  return Object.entries(materias).map(([materia, notas]) => ({
    materia,
    notas,
  }));
};

export const getMediaByAlunoTipoAndMateriaForEachBimestre = (
  alunoNome,
  materia,
  tipo
) => {
  const notasAluno = findNotasAluno(alunoNome).notas;
  const grouped = groupBy(
    notasAluno,
    (n) => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`
  );
  const materias = {};
  Object.keys(grouped).forEach((key) => {
    const [mat, bimestre] = key.split("|");
    if (mat === materia) {
      if (!materias[mat]) materias[mat] = {};
      const notasFiltradas = grouped[key].filter((nota, idx) => {
        const notaObj = notasAluno.find(
          (n) =>
            n.nota === nota &&
            n.avaliacao.materia === mat &&
            n.avaliacao.bimestre === bimestre &&
            n.avaliacao.tipo === tipo
        );
        return !!notaObj;
      });
      materias[mat][bimestre] = calcMedia(notasFiltradas);
    }
  });
  return Object.entries(materias).map(([materia, notas]) => ({
    materia,
    notas,
  }));
};

export const getNotasByAlunoAndMateriaForEachBimestre = (alunoNome, materia) =>
  groupAndCalcMedia(
    filterNotasByAlunoAndAvaliacoes(alunoNome, { materia }),
    (n) => n.avaliacao.bimestre
  );

export const getMediaByAlunoAndTipoForEachMateria = (alunoNome, tipo) =>
  groupAndCalcMedia(
    filterNotasByAlunoAndAvaliacoes(alunoNome, { tipo }),
    (n) => n.avaliacao.materia
  );

export const getMediaByAlunoBimestreForEachMateria = (alunoNome, bimestre) =>
  groupAndCalcMedia(
    filterNotasByAlunoAndAvaliacoes(alunoNome, { bimestre: Number(bimestre) }),
    (n) => n.avaliacao.materia
  );

export const getMediaByAlunoBimestreAndTipoForEachMateria = (
  alunoNome,
  bimestre,
  tipo
) =>
  groupAndCalcMedia(
    filterNotasByAlunoAndAvaliacoes(alunoNome, {
      bimestre: Number(bimestre),
      tipo,
    }),
    (n) => n.avaliacao.materia
  );

export const getMediaByAlunoMateriaAndTipoForEachBimestre = (
  alunoNome,
  materia,
  tipo
) =>
  groupAndCalcMedia(
    filterNotasByAlunoAndAvaliacoes(alunoNome, { materia, tipo }),
    (n) => n.avaliacao.bimestre
  );
