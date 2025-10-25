/**
 * Utilitários para formatação das análises geradas pela IA
 */

/**
 * Processa o HTML retornado pela IA para garantir formatação adequada
 * @param {string} aiResponse - Resposta HTML da IA
 * @returns {string} - HTML formatado com classes CSS
 */
export const formatAiResponse = (aiResponse) => {
  if (!aiResponse || typeof aiResponse !== "string") {
    return '<p class="analysis-text">Análise não disponível no momento.</p>';
  }

  let formattedResponse = aiResponse;

  // Envolver em container principal se não estiver presente
  if (
    !formattedResponse.includes("student-analysis") &&
    !formattedResponse.includes("analysis-section")
  ) {
    formattedResponse = `<div class="student-analysis">${formattedResponse}</div>`;
  }

  // Adicionar classes CSS às tags HTML se não estiverem presentes
  const formatRules = [
    // Seções
    {
      pattern: /<div(?![^>]*class)/g,
      replacement: '<div class="analysis-section"',
    },

    // Títulos
    { pattern: /<h4(?![^>]*class)/g, replacement: '<h4 class="section-title"' },
    { pattern: /<h3(?![^>]*class)/g, replacement: '<h3 class="section-title"' },

    // Parágrafos
    { pattern: /<p(?![^>]*class)/g, replacement: '<p class="analysis-text"' },

    // Destaques
    {
      pattern: /<strong(?![^>]*class)/g,
      replacement: '<strong class="highlight"',
    },

    // Listas
    {
      pattern: /<ul(?![^>]*class)/g,
      replacement: '<ul class="recommendations-list"',
    },
  ];

  formatRules.forEach((rule) => {
    formattedResponse = formattedResponse.replace(
      rule.pattern,
      rule.replacement
    );
  });

  // Adicionar ícones aos títulos baseado no conteúdo
  const iconRules = [
    { pattern: /(Desempenho\s+Geral|Performance)/i, icon: "📈" },
    { pattern: /(Pontos?\s+Fortes?|Strengths)/i, icon: "🌟" },
    {
      pattern: /(Áreas?\s+de\s+Melhoria|Areas?\s+for\s+Improvement)/i,
      icon: "📝",
    },
    { pattern: /(Recomendações?|Recommendations)/i, icon: "💡" },
    { pattern: /(Situação\s+Atual|Current\s+Situation)/i, icon: "📊" },
  ];

  iconRules.forEach((rule) => {
    const regex = new RegExp(`(<h[3-4][^>]*>)(${rule.pattern.source})`, "gi");
    formattedResponse = formattedResponse.replace(regex, `$1${rule.icon} $2`);
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

<div class="analysis-section">
  <h4 class="section-title">📊 Situação Atual</h4>
  <p class="analysis-text">Descreva a situação atual da matéria com base nos dados apresentados. Use <strong class="highlight">palavras-chave importantes</strong> para destacar pontos relevantes.</p>
</div>

<div class="analysis-section">
  <h4 class="section-title">💡 Recomendações</h4>
  <ul class="recommendations-list">
    <li>Primeira recomendação prática e específica</li>
    <li>Segunda recomendação focada em melhorias</li>
  </ul>
</div>

<div class="analysis-section">
  <h4 class="section-title">🌟 Pontos Positivos</h4>
  <p class="analysis-text">Destaque os aspectos positivos que devem ser mantidos e celebrados.</p>
</div>

Use linguagem educacional e construtiva em português brasileiro.
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

<div class="student-analysis">
  <div class="analysis-section">
    <h4 class="section-title">📈 Desempenho Geral</h4>
    <p class="analysis-text">Resumo do rendimento do aluno com <strong class="highlight">classificação do desempenho</strong> baseada na média geral.</p>
  </div>

  <div class="analysis-section">
    <h4 class="section-title">🌟 Pontos Fortes</h4>
    <p class="analysis-text">Matérias e aspectos onde o aluno se destaca. Mencione as <strong class="highlight">matérias com melhor desempenho</strong>.</p>
  </div>

  <div class="analysis-section">
    <h4 class="section-title">📝 Áreas de Melhoria</h4>
    <p class="analysis-text">Matérias que precisam de atenção especial. Identifique <strong class="highlight">oportunidades de crescimento</strong>.</p>
  </div>

  <div class="analysis-section">
    <h4 class="section-title">💡 Recomendações</h4>
    <ul class="recommendations-list">
      <li>Primeira recomendação específica e prática</li>
      <li>Segunda sugestão para melhorar o desempenho</li>
      <li>Terceira estratégia de estudo ou apoio</li>
    </ul>
  </div>
</div>

Use linguagem encorajadora e educativa em português brasileiro.
`;
};
