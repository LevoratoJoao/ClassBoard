import { notas } from "../data/notas.js";
import { alunos } from "../data/alunos.js";

const allAlunosFromNotas = notas.map((n) => n.aluno);

export const getAlunoByName = (nome) => {
  return allAlunosFromNotas.find((a) => a === nome);
};

export const getAllAlunos = () => {
  return alunos;
};

export const getAlunosByGender = (sexo) => {
  return alunos.filter((aluno) => aluno.sexo === sexo);
};

export const searchAlunosByName = (searchTerm) => {
  return alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
