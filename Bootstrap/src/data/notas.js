import { avaliacoes } from "./avaliacoes.js";

export const notas = [
    { aluno: 'João', notas: [{ avaliacao: avaliacoes[0], nota: 7 }, { avaliacao: avaliacoes[3], nota: 8 }] },
    { aluno: 'Maria', notas: [{ avaliacao: avaliacoes[1], nota: 8 }, { avaliacao: avaliacoes[0], nota: 9 }] },
    { aluno: 'Pedro', notas: [{ avaliacao: avaliacoes[2], nota: 6 }, { avaliacao: avaliacoes[4], nota: 7 }] },
    { aluno: 'Ana', notas: [{ avaliacao: avaliacoes[1], nota: 10 }, { avaliacao: avaliacoes[5], nota: 9 }] },
    { aluno: 'Lucas', notas: [{ avaliacao: avaliacoes[2], nota: 5 }, { avaliacao: avaliacoes[3], nota: 6 }] },
    { aluno: 'Beatriz', notas: [{ avaliacao: avaliacoes[4], nota: 7 }, { avaliacao: avaliacoes[5], nota: 8 }] },
    { aluno: 'Carla', notas: [{ avaliacao: avaliacoes[0], nota: 4 }, { avaliacao: avaliacoes[1], nota: 5 }] },
    { aluno: 'Rafael', notas: [{ avaliacao: avaliacoes[2], nota: 3 }, { avaliacao: avaliacoes[3], nota: 4 }] },
    { aluno: 'Sofia', notas: [{ avaliacao: avaliacoes[4], nota: 9 }, { avaliacao: avaliacoes[5], nota: 10 }] },
    { aluno: 'Marcos', notas: [{ avaliacao: avaliacoes[0], nota: 2 }, { avaliacao: avaliacoes[1], nota: 3 }] },
    { aluno: 'Fernanda', notas: [{ avaliacao: avaliacoes[2], nota: 6 }, { avaliacao: avaliacoes[3], nota: 7 }] },
    { aluno: 'Gabriel', notas: [{ avaliacao: avaliacoes[4], nota: 8 }, { avaliacao: avaliacoes[5], nota: 9 }] },
    { aluno: 'Isabela', notas: [{ avaliacao: avaliacoes[0], nota: 10 }] },
];

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
            if (notaObj.avaliacao.materia === materia && notaObj.avaliacao.bimestre === bimestre) {
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