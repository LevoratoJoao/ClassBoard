import { alunosAPI } from "./apiService";

// Funções que usam a API FastAPI
export const getAllAlunos = async () => {
  try {
    return await alunosAPI.getAllAlunos();
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return [];
  }
};

export const getAlunoById = async (aluno_id) => {
  try {
    return await alunosAPI.getAlunoById(aluno_id);
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    return null;
  }
};

export const getAlunosByGender = async (sexo) => {
  try {
    return await alunosAPI.filterAlunos(sexo);
  } catch (error) {
    console.error("Erro ao filtrar alunos por sexo:", error);
    return [];
  }
};
