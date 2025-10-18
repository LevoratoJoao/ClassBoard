import { avaliacoes } from "./avaliacoes.js";
import { alunos } from "./alunos.js";

export const notas = alunos.map((alunoObj) => ({
  aluno: alunoObj.nome,
  notas: avaliacoes.map((avaliacao) => ({
    avaliacao,
    nota: Math.floor(Math.random() * 11),
  })),
}));
