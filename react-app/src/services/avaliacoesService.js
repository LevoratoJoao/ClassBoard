import { avaliacoes } from '../data/avaliacoes.js';

const allAvaliacoes = avaliacoes.flatMap(data => data);

export const getAvaliacoes = () => allAvaliacoes;