import { avaliacoes } from '../data/avaliacoes.js';

const allAvaliacoes = avaliacoes.flatMap(data => data);

const filterAvaliacoes = (criteria = {}) =>
    allAvaliacoes.filter(avaliacao =>
        Object.entries(criteria).every(([key, value]) => avaliacao[key] === value)
    );

export const getAvaliacoes = () => allAvaliacoes;

export const getAvaliacoesByMateria = materia =>
    filterAvaliacoes({ materia });

export const getAvaliacoesByBimestre = bimestre =>
    filterAvaliacoes({ bimestre });

export const getAvaliacoesByTipo = tipo =>
    filterAvaliacoes({ tipo });

export const getAvaliacoesByMateriaAndBimestre = (materia, bimestre) =>
    filterAvaliacoes({ materia, bimestre });

export const getAvaliacoesByMateriaAndTipo = (materia, tipo) =>
    filterAvaliacoes({ materia, tipo });

export const getAvaliacoesByBimestreAndTipo = (bimestre, tipo) =>
    filterAvaliacoes({ bimestre, tipo });

export const getAvaliacoesByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
    filterAvaliacoes({ materia, tipo, bimestre });