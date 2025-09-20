import { notas } from "../data/notas.js";

const allNotas = notas.flatMap(data => data.notas);

const filterNotasByAvaliacoes = (criteria = {}) =>
    allNotas.filter(notaObj =>
        Object.entries(criteria).every(([key, value]) => notaObj.avaliacao[key] === value)
    );

const getNotaValues = notaObjs => notaObjs.map(n => n.nota);

const calcMedia = arr => arr.length ? (arr.reduce((acc, v) => acc + v, 0) / arr.length).toFixed(2) : 0;

export const getAllNotas = () => allNotas;

export const getNotasByMateria = materia =>
    getNotaValues(filterNotasByAvaliacoes({ materia }));

export const getMediaByMateria = materia =>
    calcMedia(getNotasByMateria(materia));

export const getNotasByMateriaAndBimestre = (materia, bimestre) =>
    getNotaValues(filterNotasByAvaliacoes({ materia, bimestre: Number(bimestre) }));

export const getMediaByMateriaAndBimestre = (materia, bimestre) =>
    calcMedia(getNotasByMateriaAndBimestre(materia, bimestre));

export const getNotasByMateriaAndTipo = (materia, tipo) =>
    getNotaValues(filterNotasByAvaliacoes({ materia, tipo }));

export const getMediaByMateriaAndTipo = (materia, tipo) =>
    calcMedia(getNotasByMateriaAndTipo(materia, tipo));

export const getNotasByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
    getNotaValues(filterNotasByAvaliacoes({ materia, tipo, bimestre }));

export const getMediaByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
    calcMedia(getNotasByMateriaTipoAndBimestre(materia, tipo, bimestre));

const groupBy = (arr, keyFn) => arr.reduce((acc, obj) => {
    const key = keyFn(obj);
    acc[key] = acc[key] || [];
    acc[key].push(obj.nota);
    return acc;
}, {});

export const getMediaAvaliacaoByMateriaForEachAvaliacao = materia => {
    const filtered = filterNotasByAvaliacoes({ materia });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachTipo = (materia, tipo) => {
    const filtered = filterNotasByAvaliacoes({ materia, tipo });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachBimestre = (materia, bimestre) => {
    const filtered = filterNotasByAvaliacoes({ materia, bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachTipoAndBimestre = (materia, tipo, bimestre) => {
    const filtered = filterNotasByAvaliacoes({ materia, tipo, bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}

export const getMediaAvaliacaoForEachMateria = () => {
    const grouped = groupBy(allNotas, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}

export const findNotasAluno = alunoNome =>
    notas.find(n =>
        n.aluno === alunoNome
    ) || { aluno: alunoNome, notas: [] };

export const filterNotasByAluno = (notas, criteria = {}) => {
    return notas.filter(notaObj =>
        Object.entries(criteria).every(([key, value]) => notaObj[key] === value)
    );
}

export const getNotasByAluno = alunoNome => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno;
};

export const getMediaByAluno = alunoNome =>
    calcMedia(getNotasByAluno(alunoNome));

export const getNotasByAlunoAndMateria = (alunoNome, materia) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAluno(
        notasAluno.notas,
        { avaliacao: { materia } }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoAndMateria = (alunoNome, materia) =>
    calcMedia(getNotasByAlunoAndMateria(alunoNome, materia));

export const getNotasByAlunoMateriaAndBimestre = (alunoNome, materia, bimestre) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAluno(
        notasAluno.notas,
        { avaliacao: { materia, bimestre: Number(bimestre) } }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoMateriaAndBimestre = (alunoNome, materia, bimestre) =>
    calcMedia(getNotasByAlunoMateriaAndBimestre(alunoNome, materia, bimestre));

export const getNotasByAlunoMateriaAndTipo = (alunoNome, materia, tipo) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAluno(
        notasAluno.notas,
        { avaliacao: { materia, tipo } }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoMateriaAndTipo = (alunoNome, materia, tipo) =>
    calcMedia(getNotasByAlunoMateriaAndTipo(alunoNome, materia, tipo));

export const getNotasByAlunoMateriaTipoAndBimestre = (alunoNome, materia, tipo, bimestre) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAluno(
        notasAluno.notas,
        { avaliacao: { materia, tipo, bimestre: Number(bimestre) } }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoMateriaTipoAndBimestre = (alunoNome, materia, tipo, bimestre) =>
    calcMedia(getNotasByAlunoMateriaTipoAndBimestre(alunoNome, materia, tipo, bimestre));

export const getMediaByAlunoForEachMateria = alunoNome => {
    const notasAluno = findNotasAluno(alunoNome);
    if (!notasAluno) return {};
    const grouped = groupBy(notasAluno.notas, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}

