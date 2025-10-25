/**
 * Utilitários para formatação das análises geradas pela IA
 */

/**
 * Processa o texto retornado pela IA para formatação simples
 * @param {string} aiResponse - Resposta da IA
 * @returns {string} - Texto formatado apenas com parágrafos
 */
export const formatAiResponse = (aiResponse) => {
  if (!aiResponse || typeof aiResponse !== "string") {
    return "Análise não disponível no momento.";
  }

  // Remove qualquer HTML existente e mantém apenas o texto
  let formattedResponse = aiResponse.replace(/<[^>]*>/g, "");

  // Remove asteriscos que podem vir da IA (markdown)
  formattedResponse = formattedResponse.replace(/\*\*\*/g, "");
  formattedResponse = formattedResponse.replace(/\*\*/g, "");
  formattedResponse = formattedResponse.replace(/\*/g, "");

  // Remove quebras de linha excessivas
  formattedResponse = formattedResponse.replace(/\n\s*\n/g, "\n");

  // Remove espaços extras
  formattedResponse = formattedResponse.trim();

  // Converte para HTML simples com apenas parágrafos, sem negrito
  const lines = formattedResponse.split("\n");
  let htmlResponse = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      htmlResponse += `<p>${trimmedLine}</p>`;
    }
  }

  return htmlResponse || "<p>Análise não disponível no momento.</p>";
};

/**
 * Gera um prompt simples para análise de matéria
 * @param {string} materia - Nome da matéria
 * @param {number} mediaGeral - Média geral da matéria
 * @param {number} totalAlunos - Total de alunos
 * @param {number} percentualAprovacao - Percentual de aprovação
 * @returns {string} - Prompt formatado para a IA
 */
export const buildMateriaPrompt = (
  materia,
  mediaGeral,
  totalAlunos,
  percentualAprovacao
) => {
  return `
Analise brevemente os dados de desempenho da matéria ${materia}:
- Média geral: ${mediaGeral}
- Total de alunos: ${totalAlunos}
- Percentual de aprovação: ${percentualAprovacao}%

Forneça uma análise educacional organizada seguindo esta estrutura:

Situação Atual:
[Descrição da situação atual da matéria]

Pontos Positivos:
[Aspectos positivos a serem mantidos]

Sugestões de Melhoria:
[Recomendações práticas e específicas]

Use linguagem clara e objetiva em português brasileiro.
`;
};

/**
 * Gera um prompt simples para análise de aluno
 * @param {Object} dados - Dados do aluno para análise
 * @returns {string} - Prompt formatado para a IA
 */
export const buildAlunoPrompt = (dados) => {
  const { mediaGeral, percentualAprovacao, mediasPorMateria, todasNotas } =
    dados;

  return `
Analise brevemente o desempenho do aluno com os seguintes dados:
- Média geral: ${mediaGeral}
- Percentual de aprovação: ${percentualAprovacao}%
- Médias por matéria: ${mediasPorMateria}

Forneça uma análise educacional organizada seguindo esta estrutura:

Desempenho Geral:
[Resumo do rendimento geral do aluno]

Pontos Fortes:
[Matérias onde o aluno se destaca]

Áreas de Melhoria:
[Matérias que precisam de atenção]

Recomendações:
[Sugestões práticas de melhoria]

Use linguagem encorajadora e educativa em português brasileiro.
`;
};
