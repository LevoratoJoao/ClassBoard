import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import { notasAPI, avaliacoesAPI, alunosAPI } from "./apiService";
import {
  formatAiResponse,
  buildMateriaPrompt,
  buildAlunoPrompt,
} from "../utils/aiFormatting";

// Função helper para calcular média correta considerando todas as avaliações obrigatórias
const calcularMediaCorretaAI = async (
  notasAluno,
  materia = null,
  bimestre = null,
  tipo = null
) => {
  try {
    // Buscar todas as avaliações do sistema
    const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();

    // Filtrar avaliações baseado nos critérios
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

    // Criar mapa de notas existentes
    const notasMap = {};
    notasAluno.forEach((nota) => {
      notasMap[nota.avaliacao.id] = nota.nota;
    });

    // Agrupar por matéria e calcular médias
    const mediasPorMateria = {};
    let somaGeralNotas = 0;
    let totalGeralAvaliacoes = 0;

    avaliacoesFiltradas.forEach((avaliacao) => {
      const materiaKey = avaliacao.materia;

      if (!mediasPorMateria[materiaKey]) {
        mediasPorMateria[materiaKey] = { somaNotas: 0, totalAvaliacoes: 0 };
      }

      // Usar nota existente ou 0 se não foi feita
      const nota = notasMap[avaliacao.id] || 0;
      mediasPorMateria[materiaKey].somaNotas += nota;
      mediasPorMateria[materiaKey].totalAvaliacoes += 1;

      somaGeralNotas += nota;
      totalGeralAvaliacoes += 1;
    });

    // Calcular médias finais
    const mediasFormatadas = {};
    Object.keys(mediasPorMateria).forEach((mat) => {
      const dados = mediasPorMateria[mat];
      if (dados.totalAvaliacoes > 0) {
        mediasFormatadas[mat] = (
          dados.somaNotas / dados.totalAvaliacoes
        ).toFixed(2);
      }
    });

    const mediaGeral =
      totalGeralAvaliacoes > 0
        ? (somaGeralNotas / totalGeralAvaliacoes).toFixed(2)
        : "0.00";

    return { mediasFormatadas, mediaGeral, totalGeralAvaliacoes };
  } catch (error) {
    console.error("Erro ao calcular média correta:", error);
    return {
      mediasFormatadas: {},
      mediaGeral: "0.00",
      totalGeralAvaliacoes: 0,
    };
  }
};

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

const generateAIAnalysis = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro na análise da IA:", error);
    return "Análise indisponível no momento.";
  }
};

export const buildMateriaAiAnalysis = async (materia) => {
  try {
    // Usar o mesmo método que os componentes das tabelas usam
    const notasMateria = await notasAPI.filterNotas(materia);

    if (!notasMateria || notasMateria.length === 0) {
      return {
        summary: `Análise de ${materia}: Sem dados disponíveis`,
        comment: "Não há notas suficientes para gerar uma análise.",
      };
    }

    const alunos = await alunosAPI.getAllAlunos();

    const mediaGeral = (
      notasMateria.reduce((sum, n) => sum + n.nota, 0) / notasMateria.length
    ).toFixed(2);

    const alunosAprovados = notasMateria.filter((n) => n.nota >= 6).length;
    const percentualAprovacao = (
      (alunosAprovados / alunos.length) *
      100
    ).toFixed(1);

    const prompt = buildMateriaPrompt(
      materia,
      mediaGeral,
      alunos.length,
      percentualAprovacao
    );

    const aiComment = await generateAIAnalysis(prompt);
    const formattedComment = formatAiResponse(aiComment);

    let classificacao = "Regular";
    if (parseFloat(mediaGeral) >= 8) classificacao = "Excelente";
    else if (parseFloat(mediaGeral) >= 7) classificacao = "Bom";
    else if (parseFloat(mediaGeral) >= 6) classificacao = "Satisfatório";
    else if (parseFloat(mediaGeral) < 5) classificacao = "Necessita Atenção";

    return {
      summary: `Análise de desempenho para ${materia}: ${classificacao}.`,
      comment: formattedComment,
    };
  } catch (error) {
    console.error("Erro na análise da matéria:", error);
    return {
      summary: `Análise de ${materia}: Dados indisponíveis`,
      comment: "Não foi possível gerar a análise no momento.",
    };
  }
};

export const buildAlunoAiAnalysis = async (alunoId) => {
  try {
    // Verificar se é um ID válido
    if (isNaN(alunoId) || alunoId === null || alunoId === undefined) {
      console.warn("aiService recebeu ID inválido:", alunoId);
      return {
        summary: "Dados indisponíveis para análise",
        comment: "Não foi possível analisar os dados do aluno no momento.",
      };
    }

    const notasAluno = await notasAPI.getNotasByAluno(alunoId);

    if (notasAluno.length === 0) {
      return {
        summary: "Nenhuma nota encontrada para este aluno.",
        comment: "",
      };
    }

    // Usar função de cálculo correto
    const { mediasFormatadas, mediaGeral, totalGeralAvaliacoes } =
      await calcularMediaCorretaAI(notasAluno);

    // Calcular aprovação baseado na média correta
    const mediaGeralNum = parseFloat(mediaGeral);
    const aprovado = mediaGeralNum >= 6 ? 1 : 0;
    const percentualAprovacao =
      totalGeralAvaliacoes > 0 ? (aprovado * 100).toFixed(1) : "0.0";

    const mediasPorMateria = Object.entries(mediasFormatadas)
      .map(([mat, media]) => `${mat}: ${media}`)
      .join(", ");

    const todasNotas = Object.values(mediasFormatadas).join(", ");

    const prompt = buildAlunoPrompt({
      mediaGeral,
      percentualAprovacao,
      mediasPorMateria,
      todasNotas,
    });

    const aiComment = await generateAIAnalysis(prompt);
    const formattedComment = formatAiResponse(aiComment);

    let classificacao = "Regular";
    if (mediaGeralNum >= 8) classificacao = "Excelente";
    else if (mediaGeralNum >= 7) classificacao = "Bom";
    else if (mediaGeralNum >= 6) classificacao = "Satisfatório";
    else if (mediaGeralNum < 5) classificacao = "Necessita Atenção";

    return {
      summary: `Análise do aluno: ${classificacao} (Média correta: ${mediaGeral}).`,
      comment: formattedComment,
    };
  } catch (error) {
    console.error("Erro na análise do aluno:", error);
    return {
      summary: "Análise indisponível",
      comment: "Não foi possível gerar a análise no momento.",
    };
  }
};
