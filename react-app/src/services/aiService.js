import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

import { notasAPI } from "./apiService";

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

const generateAIAnalysis = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Erro na análise da IA:", error);
        return "Análise indisponível no momento.";
    }
};

export const buildMateriaAiAnalysis = async (materia) => {
    try {
        const allNotas = await notasAPI.getAllNotas();
        const notasMateria = allNotas.filter(n => n.avaliacao.materia === materia);

        const mediaGeral = (notasMateria.reduce((sum, n) => sum + n.nota, 0) / notasMateria.length).toFixed(2);
        const totalAlunos = new Set(notasMateria.map(n => n.aluno_id)).size;
        const alunosAprovados = notasMateria.filter(n => n.nota >= 6).length;
        const percentualAprovacao = ((alunosAprovados / notasMateria.length) * 100).toFixed(1);

        const prompt = `
        Analise os dados de desempenho da matéria ${materia}:
        - Média geral: ${mediaGeral}
        - Total de alunos: ${totalAlunos}
        - Percentual de aprovação: ${percentualAprovacao}%

        Responda em máximo 3 parágrafos simples e curtos em português se possivel em tópicos, usando HTML simples (<p>, <strong>).
        Foque em: situação atual, 1 recomendação prática para melhorar o desempenho geral, e 1 ponto positivo a ser mantido.
        `;

        const aiComment = await generateAIAnalysis(prompt);

        let classificacao = "Regular";
        if (parseFloat(mediaGeral) >= 8) classificacao = "Excelente";
        else if (parseFloat(mediaGeral) >= 7) classificacao = "Bom";
        else if (parseFloat(mediaGeral) >= 6) classificacao = "Satisfatório";
        else if (parseFloat(mediaGeral) < 5) classificacao = "Necessita Atenção";

        return {
            summary: `Análise de desempenho para ${materia}: ${classificacao}.`,
            comment: aiComment
        };
    } catch (error) {
        console.error("Erro na análise da matéria:", error);
        return {
            summary: `Análise de ${materia}: Dados indisponíveis`,
            comment: "Não foi possível gerar a análise no momento."
        };
    }
};

export const buildAlunoAiAnalysis = async (alunoId) => {
    try {
        const notasAluno = await notasAPI.getNotasByAluno(alunoId);

        if (notasAluno.length === 0) {
            return {
                summary: "Nenhuma nota encontrada para este aluno.",
                comment: ""
            };
        }

        const mediaGeral = (notasAluno.reduce((sum, n) => sum + n.nota, 0) / notasAluno.length).toFixed(2);
        const aprovadas = notasAluno.filter(n => n.nota >= 6).length;
        const percentualAprovacao = ((aprovadas / notasAluno.length) * 100).toFixed(1);

        const materias = {};
        notasAluno.forEach(n => {
            if (!materias[n.avaliacao.materia]) materias[n.avaliacao.materia] = [];
            materias[n.avaliacao.materia].push(n.nota);
        });

        const mediasPorMateria = Object.entries(materias).map(([mat, notas]) => ({
            materia: mat,
            media: (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2)
        }));

        const prompt = `
    Analise o desempenho do aluno:
    - Média geral: ${mediaGeral}
    - Percentual de aprovação: ${percentualAprovacao}%
    - Médias por matéria: ${mediasPorMateria.map(m => `${m.materia}: ${m.media}`).join(', ')}
    - Todas as notas: ${notasAluno.map(n => n.nota).join(', ')}

    Forneça uma análise educacional personalizada em português com insights sobre pontos fortes, áreas de melhoria e recomendações.
    `;

        const aiComment = await generateAIAnalysis(prompt);

        let classificacao = "Regular";
        if (parseFloat(mediaGeral) >= 8) classificacao = "Excelente";
        else if (parseFloat(mediaGeral) >= 7) classificacao = "Bom";
        else if (parseFloat(mediaGeral) >= 6) classificacao = "Satisfatório";
        else if (parseFloat(mediaGeral) < 5) classificacao = "Necessita Atenção";

        return {
            summary: `Análise do aluno: ${classificacao}.`,
            comment: aiComment
        };
    } catch (error) {
        console.error("Erro na análise do aluno:", error);
        return {
            summary: "Análise indisponível",
            comment: "Não foi possível gerar a análise no momento."
        };
    }
};
