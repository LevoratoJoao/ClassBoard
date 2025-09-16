import { notas } from "../data/notas.js";

const allNotas = notas.flatMap(data => data.notas);

const filterNotas = (criteria = {}) =>
    allNotas.filter(notaObj =>
        Object.entries(criteria).every(([key, value]) => notaObj.avaliacao[key] === value)
    );

const getNotaValues = notaObjs => notaObjs.map(n => n.nota);

const calcMedia = arr => arr.length ? (arr.reduce((acc, v) => acc + v, 0) / arr.length).toFixed(2) : 0;

export const getNotasByMateria = materia =>
    getNotaValues(filterNotas({ materia }));

export const getMediaByMateria = materia =>
    calcMedia(getNotasByMateria(materia));

export const getNotasByMateriaAndBimestre = (materia, bimestre) =>
    getNotaValues(filterNotas({ materia, bimestre: Number(bimestre) }));

export const getMediaByMateriaAndBimestre = (materia, bimestre) =>
    calcMedia(getNotasByMateriaAndBimestre(materia, bimestre));

export const getNotasByMateriaAndTipo = (materia, tipo) =>
    getNotaValues(filterNotas({ materia, tipo }));

export const getMediaByMateriaAndTipo = (materia, tipo) =>
    calcMedia(getNotasByMateriaAndTipo(materia, tipo));

export const getNotasByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
    getNotaValues(filterNotas({ materia, tipo, bimestre }));

export const getMediaByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
    calcMedia(getNotasByMateriaTipoAndBimestre(materia, tipo, bimestre));

const groupBy = (arr, keyFn) => arr.reduce((acc, obj) => {
    const key = keyFn(obj);
    acc[key] = acc[key] || [];
    acc[key].push(obj.nota);
    return acc;
}, {});

export const getMediaAvaliacaoByMateriaForEachAvaliacao = materia => {
    const filtered = filterNotas({ materia });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachType = (materia, tipo) => {
    const filtered = filterNotas({ materia, tipo });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachBimestre = (materia, bimestre) => {
    const filtered = filterNotas({ materia, bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachTypeAndBimestre = (materia, tipo, bimestre) => {
    const filtered = filterNotas({ materia, tipo, bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => `${n.avaliacao.tipo} - B${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}