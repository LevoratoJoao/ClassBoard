import { notasAPI } from "./apiService";

// Função para buscar notas de um aluno específico via API
export const getNotasByAlunoFromAPI = async (alunoNome) => {
  try {
    // Mapear nome do aluno para ID
    const alunoIndex = ["Maria", "José", "Ana", "Pedro"].indexOf(
      alunoNome
    );
    if (alunoIndex === -1) {
      console.warn(`Aluno ${alunoNome} não encontrado`);
      return { notas: [] };
    }

    const notasAPI_result = await notasAPI.getNotasByAluno(alunoIndex);
    return { notas: notasAPI_result };
  } catch (error) {
    console.error("Erro ao buscar notas da API:", error);
    return { notas: [] };
  }
};

export const calcMedia = (arr) =>
  arr.length
    ? (arr.reduce((acc, v) => acc + v, 0) / arr.length).toFixed(2)
    : null;