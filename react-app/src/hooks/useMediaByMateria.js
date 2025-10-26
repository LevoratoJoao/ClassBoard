import { useState, useEffect } from "react";
import { notasAPI, avaliacoesAPI, alunosAPI } from "../services/apiService";

// Função helper para calcular média correta considerando todas as avaliações obrigatórias
const calcularMediaCorretaPorMateria = async (
  materia,
  tipo = null,
  bimestre = null
) => {
  try {
    // Buscar todas as avaliações que correspondem aos filtros
    const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();
    let avaliacoesFiltradas = todasAvaliacoes;

    if (materia && materia !== "All") {
      avaliacoesFiltradas = avaliacoesFiltradas.filter(
        (av) => av.materia === materia
      );
    }

    if (bimestre && bimestre !== "All") {
      avaliacoesFiltradas = avaliacoesFiltradas.filter(
        (av) => av.bimestre === parseInt(bimestre)
      );
    }

    if (tipo && tipo !== "All") {
      avaliacoesFiltradas = avaliacoesFiltradas.filter(
        (av) => av.tipo === tipo
      );
    }

    if (avaliacoesFiltradas.length === 0) {
      return null;
    }

    // Buscar todas as notas e todos os alunos
    const todasNotas = await notasAPI.getAllNotas();
    const todosAlunos = await alunosAPI.getAllAlunos();

    // Criar mapa de notas por avaliação
    const notasMap = {};
    todasNotas.forEach((nota) => {
      if (!notasMap[nota.aluno_id]) {
        notasMap[nota.aluno_id] = {};
      }
      notasMap[nota.aluno_id][nota.avaliacao.id] = nota.nota;
    });

    // Calcular média para cada aluno considerando todas as avaliações obrigatórias
    let somaMediasAlunos = 0;
    let countAlunosComNotas = 0;

    todosAlunos.forEach((aluno) => {
      let somaNotasAluno = 0;
      let countAvaliacoesAluno = 0;

      avaliacoesFiltradas.forEach((avaliacao) => {
        const nota = notasMap[aluno.id]?.[avaliacao.id] || 0;
        somaNotasAluno += nota;
        countAvaliacoesAluno += 1;
      });

      if (countAvaliacoesAluno > 0) {
        const mediaAluno = somaNotasAluno / countAvaliacoesAluno;
        somaMediasAlunos += mediaAluno;
        countAlunosComNotas += 1;
      }
    });

    return countAlunosComNotas > 0
      ? (somaMediasAlunos / countAlunosComNotas).toFixed(2)
      : null;
  } catch (error) {
    console.error("Erro ao calcular média correta por matéria:", error);
    return null;
  }
};

export const useMediaByMateria = (materia, tipo = null, bimestre = null) => {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      const mediaCalculada = await calcularMediaCorretaPorMateria(
        materia,
        tipo,
        bimestre
      );
      setMedia(mediaCalculada);
      setLoading(false);
    };

    fetchMedia();
  }, [materia, tipo, bimestre]);

  return { media, loading };
};
