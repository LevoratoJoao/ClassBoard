import { notas } from "../data/notas.js";

export const getNotasByMateria = materia => {
    const notasMateria = [];
    for (const data of notas) {
        for (const notaObj of data.notas) {
            if (notaObj.avaliacao.materia === materia) {
                notasMateria.push(notaObj.nota);
            }
        }
    }
    return notasMateria;
};

export const getMediaByMateria = materia => {
    const notasMateria = getNotasByMateria(materia);
    if (notasMateria.length === 0) return 0;
    const soma = notasMateria.reduce((acc, nota) => acc + nota, 0);
    return (soma / notasMateria.length).toFixed(2);
};

export const getNotasByMateriaAndBimestre = (materia, bimestre) => {
    const notasMateriaBimestre = [];
    for (const data of notas) {
        for (const notaObj of data.notas) {
            if (notaObj.avaliacao.materia === materia && notaObj.avaliacao.bimestre === Number(bimestre)) {
                notasMateriaBimestre.push(notaObj.nota);
            }
        }
    }
    return notasMateriaBimestre;
};

export const getMediaByMateriaAndBimestre = (materia, bimestre) => {
    const notasMateriaBimestre = getNotasByMateriaAndBimestre(materia, bimestre);
    if (notasMateriaBimestre.length === 0) return 0;
    const soma = notasMateriaBimestre.reduce((acc, nota) => acc + nota, 0);
    return (soma / notasMateriaBimestre.length).toFixed(2);
};

export const getNotasByMateriaAndTipo = (materia, tipo) => {
    const notasMateriaTipo = [];
    for (const data of notas) {
        for (const notaObj of data.notas) {
            if (notaObj.avaliacao.materia === materia && notaObj.avaliacao.tipo === tipo) {
                notasMateriaTipo.push(notaObj.nota);
            }
        }
    }
    return notasMateriaTipo;
};

export const getMediaByMateriaAndTipo = (materia, tipo) => {
    const notasMateriaTipo = getNotasByMateriaAndTipo(materia, tipo);
    if (notasMateriaTipo.length === 0) return 0;
    const soma = notasMateriaTipo.reduce((acc, nota) => acc + nota, 0);
    return (soma / notasMateriaTipo.length).toFixed(2);
};

export const getNotasByMateriaTipoAndBimestre = (materia, tipo, bimestre) => {
    const notasMateriaTipoBimestre = [];
    for (const data of notas) {
        for (const notaObj of data.notas) {
            if (notaObj.avaliacao.materia === materia
                && notaObj.avaliacao.tipo === tipo
                && notaObj.avaliacao.bimestre === bimestre
            ) {
                notasMateriaTipoBimestre.push(notaObj.nota);
            }
        }
    }
    return notasMateriaTipoBimestre;
};

export const getMediaByMateriaTipoAndBimestre = (materia, tipo, bimestre) => {
    const notasMateriaTipoBimestre = getNotasByMateriaTipoAndBimestre(materia, tipo, bimestre);
    if (notasMateriaTipoBimestre.length === 0) return 0;
    const soma = notasMateriaTipoBimestre.reduce((acc, nota) => acc + nota, 0);
    return (soma / notasMateriaTipoBimestre.length).toFixed(2);
};

export const getMediaAvaliacaoByMateriaForEachAvaliacao = (materia) => {
    const medias = {};
    for (const data of notas) {
        for (const notaObj of data.notas) {
            if (notaObj.avaliacao.materia === materia) {
                const key = `${notaObj.avaliacao.tipo} - Bimestre ${notaObj.avaliacao.bimestre}`;
                if (!medias[key]) {
                    medias[key] = { total: 0, count: 0 };
                }
                medias[key].total += notaObj.nota;
                medias[key].count += 1;
            }
        }
    }
    const resultado = {};
    for (const key in medias) {
        resultado[key] = (medias[key].total / medias[key].count).toFixed(2);
    }
    return resultado;
};

export const getMediaAvaliacaoByMateriaForEachType = (materia, tipo) => {
    const medias = {};
    for (const data of notas) {
        for (const notaObj of data.notas) {
            if (notaObj.avaliacao.materia === materia && notaObj.avaliacao.tipo === tipo) {
                const key = `${notaObj.avaliacao.tipo} - Bimestre ${notaObj.avaliacao.bimestre}`;
                if (!medias[key]) {
                    medias[key] = { total: 0, count: 0 };
                }
                medias[key].total += notaObj.nota;
                medias[key].count += 1;
            }
        }
    }
    const resultado = {};
    for (const key in medias) {
        resultado[key] = (medias[key].total / medias[key].count).toFixed(2);
    }
    return resultado;
};

export const getMediaAvaliacaoByMateriaForEachBimestre = (materia, bimestre) => {
    const medias = {};
    for (const data of notas) {
        for (const notaObj of data.notas) {
            if (notaObj.avaliacao.materia === materia && notaObj.avaliacao.bimestre === Number(bimestre)) {
                const key = `Tipo ${notaObj.avaliacao.tipo}`;
                if (!medias[key]) {
                    medias[key] = { total: 0, count: 0 };
                }
                medias[key].total += notaObj.nota;
                medias[key].count += 1;
            }
        }
    }
    const resultado = {};
    for (const key in medias) {
        resultado[key] = (medias[key].total / medias[key].count).toFixed(2);
    }
    return resultado;
};