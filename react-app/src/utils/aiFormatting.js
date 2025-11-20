/**
 * Utilitários para formatação das análises geradas pela IA
 */

/**
 * Processa o HTML retornado pela IA para garantir formatação adequada
 * @param {string} aiResponse - Resposta HTML da IA
 * @returns {string} - HTML formatado com classes CSS específicas para IA
 */
export const formatAiResponse = (aiResponse) => {
  if (!aiResponse || typeof aiResponse !== "string") {
    return '<div class="ai-analysis-content"><p class="ai-analysis-text">Análise não disponível no momento.</p></div>';
  }

  let formattedResponse = aiResponse;

  // Envolver em container principal se não estiver presente
  if (!formattedResponse.includes("ai-analysis-content")) {
    formattedResponse = `<div class="ai-analysis-content">${formattedResponse}</div>`;
  }

  // Adicionar classes CSS específicas para IA às tags HTML se não estiverem presentes
  const formatRules = [
    // Seções
    {
      pattern: /<div(?![^>]*class)/g,
      replacement: '<div class="ai-analysis-section"',
    },

    // Títulos
    {
      pattern: /<h4(?![^>]*class)/g,
      replacement: '<h4 class="ai-section-title"',
    },
    {
      pattern: /<h3(?![^>]*class)/g,
      replacement: '<h3 class="ai-section-title"',
    },

    // Parágrafos
    {
      pattern: /<p(?![^>]*class)/g,
      replacement: '<p class="ai-analysis-text"',
    },

    // Destaques
    {
      pattern: /<strong(?![^>]*class)/g,
      replacement: '<strong class="ai-highlight"',
    },

    // Listas
    {
      pattern: /<ul(?![^>]*class)/g,
      replacement: '<ul class="ai-recommendations-list"',
    },
  ];

  formatRules.forEach((rule) => {
    formattedResponse = formattedResponse.replace(
      rule.pattern,
      rule.replacement
    );
  });


  return formattedResponse;
};

/**
 * Gera um prompt melhorado para análise de matéria
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
Analise os dados de desempenho da matéria ${materia}:
- Média geral: ${mediaGeral}
- Total de alunos: ${totalAlunos}
- Percentual de aprovação: ${percentualAprovacao}%

Forneça uma análise estruturada seguindo EXATAMENTE este formato HTML:

<div class="ai-analysis-section">
  <h4 class="ai-section-title">Situação Atual</h4>
  <p class="ai-analysis-text">Descreva a situação atual da matéria com base nos dados apresentados. Use <strong class="ai-highlight">palavras-chave importantes</strong> para destacar pontos relevantes.</p>
</div>

<div class="ai-analysis-section">
  <h4 class="ai-section-title">Recomendações</h4>
  <ul class="ai-recommendations-list">
    <li>Primeira recomendação prática e específica</li>
    <li>Segunda recomendação focada em melhorias</li>
  </ul>
</div>

<div class="ai-analysis-section">
  <h4 class="ai-section-title">Pontos Positivos</h4>
  <p class="ai-analysis-text">Destaque os aspectos positivos que devem ser mantidos e celebrados.</p>
</div>

Use linguagem educacional e construtiva em português brasileiro e SEM EMOJIS NA RESPOSTA, POR FAVOR.
`;
};

/**
 * Gera um prompt melhorado para análise de aluno
 * @param {Object} dados - Dados do aluno para análise
 * @returns {string} - Prompt formatado para a IA
 */
export const buildAlunoPrompt = (dados) => {
  const { mediaGeral, percentualAprovacao, mediasPorMateria, todasNotas } =
    dados;

  return `
Analise o desempenho do aluno com os seguintes dados:
- Média geral: ${mediaGeral}
- Percentual de aprovação: ${percentualAprovacao}%
- Médias por matéria: ${mediasPorMateria}
- Todas as notas: ${todasNotas}

Forneça uma análise educacional seguindo EXATAMENTE este formato HTML:

<div class="ai-analysis-section">
  <h4 class="ai-section-title">Desempenho Geral</h4>
  <p class="ai-analysis-text">Resumo do rendimento do aluno com <strong class="ai-highlight">classificação do desempenho</strong> baseada na média geral.</p>
</div>

<div class="ai-analysis-section">
  <h4 class="ai-section-title">Pontos Fortes</h4>
  <p class="ai-analysis-text">Matérias e aspectos onde o aluno se destaca. Mencione as <strong class="ai-highlight">matérias com melhor desempenho</strong>.</p>
</div>

<div class="ai-analysis-section">
  <h4 class="ai-section-title">Áreas de Melhoria</h4>
  <p class="ai-analysis-text">Matérias que precisam de atenção especial. Identifique <strong class="ai-highlight">oportunidades de crescimento</strong>.</p>
</div>

<div class="ai-analysis-section">
  <h4 class="ai-section-title">Recomendações</h4>
  <ul class="ai-recommendations-list">
    <li>Primeira recomendação específica e prática</li>
    <li>Segunda sugestão para melhorar o desempenho</li>
    <li>Terceira estratégia de estudo ou apoio</li>
  </ul>
</div>

Use linguagem encorajadora e educativa em português brasileiro e SEM EMOJIS NA RESPOSTA, POR FAVOR.
`;
};
