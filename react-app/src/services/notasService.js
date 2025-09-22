import { notas } from "../data/notas.js";
import { alunos } from "../data/alunos.js";

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
    const grouped = groupBy(filtered, n => `Bimestre ${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachTipo = (materia, tipo) => {
    const filtered = filterNotasByAvaliacoes({ materia, tipo });
    const grouped = groupBy(filtered, n => `Bimestre ${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachBimestre = (materia, bimestre) => {
    const filtered = filterNotasByAvaliacoes({ materia, bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => `Bimestre ${n.avaliacao.bimestre}`);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaAvaliacaoByMateriaForEachTipoAndBimestre = (materia, tipo, bimestre) => {
    const filtered = filterNotasByAvaliacoes({ materia, tipo, bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => `Bimestre ${n.avaliacao.bimestre}`);
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

export const getMediaAvaliacaoByBimestreForEachMateria = (bimestre) => {
    const filtered = filterNotasByAvaliacoes({ bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}

export const getMediaAvaliacaoByTipoForEachMateria = (tipo) => {
    const filtered = filterNotasByAvaliacoes({ tipo });
    const grouped = groupBy(filtered, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}

export const getMediaAvaliacaoByTipoAndBimestreForEachMateria = (tipo, bimestre) => {
    const filtered = filterNotasByAvaliacoes({ tipo, bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}

export const getMediaForEachMateria = () => {
    const materias = [...new Set(allNotas.map(n => n.avaliacao.materia))];
    return materias.map(materia => ({
        materia,
        media: getMediaByMateria(materia)
    }));
}

export const findNotasAluno = alunoNome =>
    notas.find(n =>
        n.aluno === alunoNome
    ) || { aluno: alunoNome, notas: [] };


export const filterNotasByAlunoAndAvaliacoes = (alunoNome, criteria = {}) => {
    const notasAluno = findNotasAluno(alunoNome);
    if (!notasAluno || !notasAluno.notas) return [];
    return notasAluno.notas.filter(notaObj =>
        Object.entries(criteria).every(([key, value]) => notaObj.avaliacao[key] === value)
    );
};

export const getNotasAlunoValues = alunoNome => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? notasAluno.notas.map(n => n.nota) : [];
};

export const getNotasByAluno = alunoNome => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno;
};

export const getMediaByAluno = alunoNome =>
    calcMedia(getNotasAlunoValues(alunoNome));

export const getNotasByAlunoAndMateria = (alunoNome, materia) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? (
        filterNotasByAlunoAndAvaliacoes(alunoNome, { materia })
    ).map(n => n.nota) : [];
};

export const getNotasByAlunoBimestreAndTipo = (alunoNome, bimestre, tipo) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAlunoAndAvaliacoes(alunoNome, { bimestre: Number(bimestre), tipo }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoBimestreAndTipo = (alunoNome, bimestre, tipo) =>
    calcMedia(getNotasByAlunoBimestreAndTipo(alunoNome, bimestre, tipo));

export const getNotasByAlunoAndBimestre = (alunoNome, bimestre) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAlunoAndAvaliacoes(alunoNome, { bimestre: Number(bimestre) }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoAndBimestre = (alunoNome, bimestre) =>
    calcMedia(getNotasByAlunoAndBimestre(alunoNome, bimestre));

export const getNotasByAlunoAndTipo = (alunoNome, tipo) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAlunoAndAvaliacoes(alunoNome, { tipo }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoAndTipo = (alunoNome, tipo) =>
    calcMedia(getNotasByAlunoAndTipo(alunoNome, tipo));

export const getMediaByAlunoAndMateria = (alunoNome, materia) =>
    calcMedia(getNotasByAlunoAndMateria(alunoNome, materia));

export const getNotasByAlunoMateriaAndBimestre = (alunoNome, materia, bimestre) => {
    const notasAluno = findNotasAluno(alunoNome);
    const result = filterNotasByAlunoAndAvaliacoes(alunoNome, { materia, bimestre: Number(bimestre) });
    return notasAluno ? result.map(n => n.nota) : [];
}

export const getMediaByAlunoMateriaAndBimestre = (alunoNome, materia, bimestre) =>
    calcMedia(getNotasByAlunoMateriaAndBimestre(alunoNome, materia, bimestre));

export const getNotasByAlunoMateriaAndTipo = (alunoNome, materia, tipo) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAlunoAndAvaliacoes(alunoNome, { materia, tipo }
    ).map(n => n.nota) : [];
};

export const getMediaByAlunoMateriaAndTipo = (alunoNome, materia, tipo) =>
    calcMedia(getNotasByAlunoMateriaAndTipo(alunoNome, materia, tipo));

export const getNotasByAlunoMateriaTipoAndBimestre = (alunoNome, materia, tipo, bimestre) => {
    const notasAluno = findNotasAluno(alunoNome);
    return notasAluno ? filterNotasByAlunoAndAvaliacoes(alunoNome, { materia, tipo, bimestre }
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

export const getMediaForEachAluno = () => {
    const medias = alunos.map(aluno => {
        const media = getMediaByAluno(aluno.nome);
        return { aluno: aluno.nome, media };
    });
    return medias;
}

export const getMediaByAlunoForEachMateriaAndBimestre = (alunoNome) => {
    const notasAluno = findNotasAluno(alunoNome);
    if (!notasAluno) return [];
    const grouped = groupBy(notasAluno.notas, n => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`);
    const materias = {};

    Object.keys(grouped).forEach(key => {
        const [materia, bimestre] = key.split('|');
        if (!materias[materia]) materias[materia] = {};
        materias[materia][bimestre] = calcMedia(grouped[key]);
    });

    return Object.entries(materias).map(([materia, notas]) => ({
        materia,
        notas
    }));
};

export const getMediaByAlunoAndTipoForEachMateriaAndBimestre = (alunoNome, tipo) => {
    const notasAluno = findNotasAluno(alunoNome);
    if (!notasAluno) return [];
    const filtered = filterNotasByAlunoAndAvaliacoes(alunoNome, { tipo });
    const grouped = groupBy(filtered, n => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`);
    const materias = {};

    Object.keys(grouped).forEach(key => {
        const [materia, bimestre] = key.split('|');
        if (!materias[materia]) materias[materia] = {};
        materias[materia][bimestre] = calcMedia(grouped[key]);
    });

    return Object.entries(materias).map(([materia, notas]) => ({
        materia,
        notas
    }));
};

export const getMediaByAlunoAndMateriaForEachBimestre = (alunoNome, materia) => {
    const notasAluno = findNotasAluno(alunoNome);
    if (!notasAluno) return [];
    const grouped = groupBy(notasAluno.notas, n => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`);
    const materias = {};

    Object.keys(grouped).forEach(key => {
        const [mat, bimestre] = key.split('|');
        if (mat === materia) {
            if (!materias[mat]) materias[mat] = {};
            materias[mat][bimestre] = calcMedia(grouped[key]);
        }
    });

    return Object.entries(materias).map(([materia, notas]) => ({
        materia,
        notas
    }));
}

export const getMediaByAlunoTipoAndMateriaForEachBimestre = (alunoNome, materia, tipo) => {
    const notasAluno = findNotasAluno(alunoNome);
    if (!notasAluno) return [];
    const grouped = groupBy(notasAluno.notas, n => `${n.avaliacao.materia}|${n.avaliacao.bimestre}`);
    const materias = {};

    Object.keys(grouped).forEach(key => {
        const [mat, bimestre] = key.split('|');
        if (mat === materia) {
            const notasFilteredByTipo = grouped[key].filter((_, index) => notasAluno.notas[index].avaliacao.tipo === tipo);
            if (notasFilteredByTipo.length > 0) {
                if (!materias[mat]) materias[mat] = {};
                materias[mat][bimestre] = calcMedia(notasFilteredByTipo);
            }
        }
    });

    return Object.entries(materias).map(([materia, notas]) => ({
        materia,
        notas
    }));
}

export const getNotasByAlunoAndMateriaForEachBimestre = (alunoNome, materia) => {
    const filtered = filterNotasByAlunoAndAvaliacoes(alunoNome, { materia });
    const grouped = groupBy(filtered, n => n.avaliacao.bimestre);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaByAlunoAndTipoForEachMateria = (alunoNome, tipo) => {
    const filtered = filterNotasByAlunoAndAvaliacoes(alunoNome, { tipo });
    const grouped = groupBy(filtered, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaByAlunoBimestreForEachMateria = (alunoNome, bimestre) => {
    const filtered = filterNotasByAlunoAndAvaliacoes(alunoNome, { bimestre: Number(bimestre) });
    const grouped = groupBy(filtered, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaByAlunoBimestreAndTipoForEachMateria = (alunoNome, bimestre, tipo) => {
    const filtered = filterNotasByAlunoAndAvaliacoes(alunoNome, { bimestre: Number(bimestre), tipo });
    const grouped = groupBy(filtered, n => n.avaliacao.materia);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
};

export const getMediaByAlunoMateriaAndTipoForEachBimestre = (alunoNome, materia, tipo) => {
    const filtered = filterNotasByAlunoAndAvaliacoes(alunoNome, { materia, tipo });
    const grouped = groupBy(filtered, n => n.avaliacao.bimestre);
    const result = {};
    for (const key in grouped) result[key] = calcMedia(grouped[key]);
    return result;
}
