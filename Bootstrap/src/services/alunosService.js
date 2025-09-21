import { notas } from "../data/notas.js";

const allAlunos = notas.map(n => n.aluno);

export const getAlunoByName = nome =>
    allAlunos.find(a => a === nome);
