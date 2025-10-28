import jsPDF from "jspdf";
import { getAllAlunos } from "../services/alunosService";
import { notasAPI, avaliacoesAPI } from "../services/apiService";
import {
  buildMateriaAiAnalysis,
  buildAlunoAiAnalysis,
} from "../services/aiService";
import cerebroIcon from "../assets/images/cerebro.webp";

// Função específica para limpar nomes de pessoas (alunos, etc)
const limparNome = (nome) => {
  if (!nome) return "Nome não disponível";

  return String(nome)
    .replace(/Ø=Ü./g, "")
    .replace(/Ø=Ü/g, "")
    .replace(/ÃƒÂ/g, "")
    .replace(/[ÃØÜ]/g, "")
    .replace(/[^\x20-\x7E\u00C0-\u00FF]/g, "") // Manter apenas ASCII + acentos latinos
    .replace(/\s+/g, " ") // Normalizar espaços
    .trim();
};

// Função para gerar análise de fallback baseada em dados estatísticos
const gerarAnaliseFallback = (tipo, nome, dados = {}) => {
  if (tipo === "materia") {
    const { media = 0, totalAlunos = 0, percentualAprovacao = 0 } = dados;

    let classificacao = "Regular";
    let recomendacao = "Manter acompanhamento.";

    if (media >= 8) {
      classificacao = "Excelente";
      recomendacao = "Continuar com as estratégias atuais.";
    } else if (media >= 7) {
      classificacao = "Bom";
      recomendacao = "Pequenos ajustes para melhorar ainda mais.";
    } else if (media >= 6) {
      classificacao = "Satisfatório";
      recomendacao = "Identificar pontos de melhoria específicos.";
    } else if (media < 5) {
      classificacao = "Necessita Atenção";
      recomendacao = "Intervenção pedagógica urgente recomendada.";
    }

    return {
      summary: `Análise de ${nome}: ${classificacao} (Média: ${media}).`,
      comment: `A matéria ${nome} apresenta média de ${media} pontos com ${percentualAprovacao}% de aprovação entre ${totalAlunos} alunos. ${recomendacao} O desempenho indica ${classificacao.toLowerCase()} rendimento da turma nesta disciplina.`,
    };
  } else if (tipo === "aluno") {
    const { mediaGeral = 0, situacao = "Em avaliação" } = dados;

    let status = "Regular";
    let orientacao = "Acompanhar desenvolvimento.";

    if (mediaGeral >= 8) {
      status = "Excelente";
      orientacao = "Manter o bom desempenho e servir de exemplo.";
    } else if (mediaGeral >= 7) {
      status = "Bom";
      orientacao = "Pequenos ajustes podem levar à excelência.";
    } else if (mediaGeral >= 6) {
      status = "Satisfatório";
      orientacao = "Foco em matérias com menor desempenho.";
    } else if (mediaGeral < 6) {
      status = "Necessita Apoio";
      orientacao = "Reforço escolar e acompanhamento próximo recomendados.";
    }

    return {
      summary: `Análise do aluno ${nome}: ${status} (Média geral: ${mediaGeral}).`,
      comment: `O estudante ${nome} apresenta média geral de ${mediaGeral} pontos, situação acadêmica ${situacao}. ${orientacao} O desempenho demonstra necessidade de ${status.toLowerCase()} acompanhamento pedagógico.`,
    };
  }

  return {
    summary: `Análise de ${nome}: Dados em processamento.`,
    comment:
      "Análise detalhada será disponibilizada em breve com base nos dados coletados.",
  };
};


// Improved text cleaning function
const limparTextoParaPDF = (texto) => {
  if (!texto) return "";

  return String(texto)
    // Fix common encoding issues
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€¢/g, "•")
    .replace(/â€"/g, "-")
    // Fix Portuguese characters
    .replace(/Ã§/g, "ç")
    .replace(/Ã£/g, "ã")
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã /g, "à")
    .replace(/Ãª/g, "ê")
    .replace(/Ã´/g, "ô")
    .replace(/Ãµ/g, "õ")
    .replace(/Ã¢/g, "â")
    // Remove only problematic sequences, keep valid characters
    .replace(/[^\x20-\x7E\u00C0-\u017F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};


// Função para processar e formatar texto da IA para PDF
const formatarTextoIAParaPDF = (texto) => {
  if (!texto) return "Análise não disponível.";

  let textoFormatado = String(texto);

  // Processar HTML básico para formatação de texto
  textoFormatado = textoFormatado
    // Quebras de linha
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")

    // Headers - converter para texto com emojis
    .replace(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi, (match, content) => {
      // Adicionar emoji baseado no conteúdo
      if (/desempenho\s+geral/i.test(content))
        return `${content.toUpperCase()}\n`;
      if (/pontos?\s+fortes?/i.test(content))
        return `${content.toUpperCase()}\n`;
      if (/áreas?\s+de\s+melhoria/i.test(content))
        return `${content.toUpperCase()}\n`;
      if (/recomendações?/i.test(content))
        return `${content.toUpperCase()}\n`;
      if (/situação\s+atual/i.test(content))
        return `${content.toUpperCase()}\n`;
      return `• ${content.toUpperCase()}\n`;
    })

    // Listas
    .replace(/<ul[^>]*>/gi, "")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<li[^>]*>([^<]+)<\/li>/gi, "• $1\n")

    // Formatação de texto
    .replace(/<strong[^>]*>([^<]+)<\/strong>/gi, "$1")
    .replace(/<b[^>]*>([^<]+)<\/b>/gi, "$1")
    .replace(/<em[^>]*>([^<]+)<\/em>/gi, "$1")
    .replace(/<i[^>]*>([^<]+)<\/i>/gi, "$1")

    // Remover outras tags HTML
    .replace(/<[^>]+>/g, "")

    // Processar markdown se houver
    .replace(/#{1,6}\s*([^\n]+)/g, "• $1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")

    // Normalizar espaços e quebras
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  return textoFormatado;
};

// Função para renderizar texto formatado no PDF com quebras e seções
const renderTextoFormatado = (doc, texto, x, y, maxWidth, lineHeight = 5) => {
  let currentY = y;
  const lines = texto.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      currentY += lineHeight * 0.5;
      continue;
    }

    // Check if it's a title
    const isTitulo = line === line.toUpperCase() && line.length > 3 && line.length < 60;

    if (isTitulo) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(44, 62, 80);

      const tituloLines = doc.splitTextToSize(line, maxWidth);
      tituloLines.forEach((tituloLine) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(tituloLine, x, currentY);
        currentY += lineHeight;
      });
      currentY += 2;
    } else if (line.startsWith("• ")) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(44, 62, 80);

      const itemText = line.substring(2);
      const itemLines = doc.splitTextToSize(`• ${itemText}`, maxWidth);
      itemLines.forEach((itemLine) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(itemLine, x, currentY);
        currentY += lineHeight;
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(44, 62, 80);

      const normalLines = doc.splitTextToSize(line, maxWidth);
      normalLines.forEach((normalLine) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(normalLine, x, currentY);
        currentY += lineHeight;
      });
    }
  }

  return currentY;
};


// Função para renderizar análise de IA com formatação melhorada
const renderAiAnalysis = (
  doc,
  analise,
  x,
  y,
  maxWidth,
  colors = { header: [52, 152, 219], text: [44, 62, 80] }
) => {
  let currentY = y;

  // Limpar e processar os textos com validação extra
  let summaryLimpo = "";
  let comentarioLimpo = "";

  try {
    // Processar e formatar os textos da IA mantendo a formatação
    summaryLimpo = formatarTextoIAParaPDF(
      analise.summary || "Análise disponível: Desempenho em avaliação."
    );
    comentarioLimpo = formatarTextoIAParaPDF(
      analise.comment ||
      "Análise detalhada em processamento. Dados estatísticos disponíveis no relatório."
    );

    // Se após formatação o texto ficou vazio ou muito pequeno, usar fallback
    if (!summaryLimpo || summaryLimpo.length < 10) {
      summaryLimpo = "Análise disponível: Desempenho em avaliação.";
    }

    if (!comentarioLimpo || comentarioLimpo.length < 20) {
      comentarioLimpo =
        "Análise detalhada em processamento. Dados estatísticos disponíveis no relatório.";
    }
  } catch (error) {
    console.warn("Erro ao processar texto da IA:", error);
    summaryLimpo = "Análise indisponível no momento.";
    comentarioLimpo = "Erro ao processar análise da IA.";
  }

  // Renderizar summary com estilo destacado
  doc.setFillColor(colors.header[0], colors.header[1], colors.header[2]);
  doc.setDrawColor(
    colors.header[0] - 20,
    colors.header[1] - 20,
    colors.header[2] - 20
  );

  // Calcular altura necessária para o summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const linhasSummary = doc.splitTextToSize(summaryLimpo, maxWidth - 20);
  const summaryHeight = Math.max(15, linhasSummary.length * 4.5 + 8);

  // Caixa para o summary
  doc.roundedRect(x, currentY, maxWidth, summaryHeight, 2, 2, "FD");

  // Ícone de IA
  doc.setFillColor(255, 255, 255);
  doc.circle(x + 8, currentY + 8, 3, "F");
  doc.setTextColor(colors.header[0], colors.header[1], colors.header[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("IA", x + 8, currentY + 10, { align: "center" });

  // Texto do summary
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  linhasSummary.forEach((linha, index) => {
    doc.text(linha, x + 18, currentY + 8 + index * 4.5);
  });

  currentY += summaryHeight + 5;

  // Renderizar comentário detalhado
  if (comentarioLimpo && comentarioLimpo.trim()) {
    // Calcular altura necessária baseada no conteúdo formatado
    const comentarioHeight = Math.max(
      40,
      comentarioLimpo.split("\n").length * 5 + 15
    );

    // Caixa sutil para o comentário
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, currentY, maxWidth, comentarioHeight, 2, 2, "FD");

    // Renderizar texto formatado com a nova função
    const finalY = renderTextoFormatado(
      doc,
      comentarioLimpo,
      x + 5,
      currentY + 8,
      maxWidth - 10
    );
    currentY = Math.max(currentY + comentarioHeight, finalY);
  }

  return currentY + 5; // Retorna a nova posição Y
};

// Função para justificar texto no PDF
const drawJustifiedText = (doc, text, x, y, maxWidth, lineHeight = 4.5) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  let currentY = y;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isLastLine = i === lines.length - 1;
    const words = line.split(" ").filter((word) => word.length > 0);

    // Se a linha está vazia ou tem apenas uma palavra, não justificar
    if (words.length <= 1 || isLastLine) {
      doc.text(line, x, currentY);
    } else {
      // Calcular largura total das palavras
      const wordsWidth =
        words.reduce((sum, word) => sum + doc.getTextWidth(word + " "), 0) -
        doc.getTextWidth(" ");

      // Se a linha é muito curta comparada ao maxWidth, não justificar
      if (wordsWidth < maxWidth * 0.7) {
        doc.text(line, x, currentY);
      } else {
        // Justificar distribuindo espaços
        const totalSpaceNeeded = maxWidth - wordsWidth;
        const spaceBetweenWords = totalSpaceNeeded / (words.length - 1);

        let currentX = x;
        for (let j = 0; j < words.length; j++) {
          doc.text(words[j], currentX, currentY);
          if (j < words.length - 1) {
            currentX +=
              doc.getTextWidth(words[j]) +
              spaceBetweenWords +
              doc.getTextWidth(" ");
          }
        }
      }
    }
    currentY += lineHeight;
  }

  return currentY;
};

// Função para converter imagem para base64
const imageToBase64 = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

// Funções estatísticas simples (sem biblioteca externa)
const calculateStats = (valores) => {
  if (!valores || valores.length === 0)
    return { media: 0, mediana: 0, desvio: 0 };

  const sorted = [...valores].sort((a, b) => a - b);
  const n = valores.length;
  const media = valores.reduce((sum, val) => sum + val, 0) / n;
  const mediana =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
  const variancia =
    valores.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / n;
  const desvio = Math.sqrt(variancia);

  return {
    media: parseFloat(media.toFixed(2)),
    mediana: parseFloat(mediana.toFixed(2)),
    desvio: parseFloat(desvio.toFixed(2)),
    minimo: Math.min(...valores),
    maximo: Math.max(...valores),
  };
};

// Função para gerar análise IA das estatísticas
const generateStatsAnalysis = async (
  estatisticas,
  totalAlunos,
  totalNotas,
  analisesMateria
) => {
  // Extrair insights das análises de matérias
  const materiasComProblemas = [];
  const materiasExcelentes = [];

  Object.entries(analisesMateria).forEach(([materia, analise]) => {
    const summary = analise.summary.toLowerCase();
    if (summary.includes("necessita atenção") || summary.includes("regular")) {
      materiasComProblemas.push(materia);
    } else if (summary.includes("excelente") || summary.includes("bom")) {
      materiasExcelentes.push(materia);
    }
  });

  const prompt = `Analise estas estatísticas educacionais e forneça insights importantes em português brasileiro:

  - Total de Alunos: ${totalAlunos}
  - Total de Notas Registradas: ${totalNotas}
  - Média Geral da Turma: ${estatisticas.media}
  - Mediana: ${estatisticas.mediana}
  - Desvio Padrão: ${estatisticas.desvio}
  - Nota Mínima: ${estatisticas.minimo}
  - Nota Máxima: ${estatisticas.maximo}
  - Matérias com bom desempenho: ${materiasExcelentes.join(", ") || "Nenhuma identificada"
    }
  - Matérias que necessitam atenção: ${materiasComProblemas.join(", ") || "Nenhuma identificada"
    }

  Forneça uma análise integrada considerando tanto as estatísticas quanto o desempenho por matéria.
  Seja direto e objetivo em máximo 4 parágrafos. Inclua recomendações práticas para a gestão escolar. SEM EMOJIS NA RESPOSTA POR FAVOR.`;

  try {
    // Usar a mesma estrutura do aiService.js
    const { GoogleGenAI } = require("@google/genai");
    const ai = new GoogleGenAI({
      apiKey: process.env.REACT_APP_GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.warn("Erro na análise IA, usando análise automática:", error);

    // Análise automática como fallback
    let analise = "";

    // Análise do desempenho (mais concisa)
    if (estatisticas.media >= 8) {
      analise +=
        "Desempenho Excelente: Turma com média superior a 8.0, demonstrando domínio dos conteúdos. ";
    } else if (estatisticas.media >= 6) {
      analise +=
        "Desempenho Satisfatório: Média adequada (6.0+) indica aproveitamento esperado. ";
    } else {
      analise +=
        "Atenção Necessária: Média baixa requer intervenção pedagógica urgente. ";
    }

    // Análise da variabilidade
    if (estatisticas.desvio <= 1.5) {
      analise +=
        "Turma Homogênea: Baixa variabilidade indica desempenho consistente entre alunos. ";
    } else if (estatisticas.desvio > 2.5) {
      analise += `Alta Variabilidade: Desvio de ${estatisticas.desvio} indica grandes diferenças individuais. `;
    } else {
      analise +=
        "Variabilidade Moderada: Algumas diferenças no desempenho entre alunos. ";
    }

    // Análise da amplitude (mais concisa)
    const amplitude = estatisticas.maximo - estatisticas.minimo;
    if (amplitude > 6) {
      analise += `Amplitude ${amplitude.toFixed(
        1
      )} pontos revela diversidade de níveis na turma. `;
    }

    // Recomendação final
    if (estatisticas.media < 6 || estatisticas.desvio > 2.5) {
      analise +=
        "💡 Recomenda-se acompanhamento individualizado e reforço pedagógico.";
    } else {
      analise +=
        "💡 Turma dentro dos padrões esperados, manter estratégias atuais.";
    }

    return analise;
  }
};
const generateSimpleChart = async (data, type = "bar") => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    // Aumentar altura para gráficos com legendas
    canvas.height = type === "comparison" || type === "bimestral" ? 380 : 300;
    const ctx = canvas.getContext("2d");

    // Configurações do gráfico
    const padding = 50;
    const chartWidth = canvas.width - 2 * padding;
    // Ajustar altura do gráfico para deixar mais espaço para legendas
    const chartHeight =
      type === "comparison" || type === "bimestral"
        ? canvas.height - 2 * padding - 80
        : canvas.height - 2 * padding;

    // Limpar canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (type === "bar" && data.labels && data.values) {
      const maxValue = Math.max(...data.values);
      const barWidth = chartWidth / data.labels.length;

      // Desenhar barras
      data.values.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.1;
        const y = padding + chartHeight - barHeight;

        // Cor da barra baseada no valor
        if (value >= 8) ctx.fillStyle = "#2ecc71"; // Verde
        else if (value >= 6) ctx.fillStyle = "#3498db"; // Azul
        else if (value >= 4) ctx.fillStyle = "#f39c12"; // Laranja
        else ctx.fillStyle = "#e74c3c"; // Vermelho

        ctx.fillRect(x, y, barWidth * 0.8, barHeight);

        // Texto do valor
        ctx.fillStyle = "#2c3e50";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(value.toFixed(1), x + barWidth * 0.4, y - 5);

        // Label da matéria
        ctx.save();
        ctx.translate(x + barWidth * 0.4, padding + chartHeight + 15);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(data.labels[index], 0, 0);
        ctx.restore();
      });

      // Título
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        data.title || "Gráfico Prova X Trabalho",
        canvas.width / 2,
        25
      );
    }

    // Gráfico de pizza
    if (type === "pie" && data.labels && data.values) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20;
      const total = data.values.reduce((sum, val) => sum + val, 0);

      let currentAngle = -Math.PI / 2; // Começar do topo

      const colors = ["#2ecc71", "#3498db", "#f39c12", "#e74c3c", "#9b59b6"];

      data.values.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;

        // Desenhar fatia
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          radius,
          currentAngle,
          currentAngle + sliceAngle
        );
        ctx.closePath();
        ctx.fill();

        // Desenhar borda
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label e percentual
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

        const percentage = ((value / total) * 100).toFixed(1);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${percentage}%`, labelX, labelY);

        currentAngle += sliceAngle;
      });

      // Legenda
      data.labels.forEach((label, index) => {
        const legendX = padding;
        const legendY = padding + index * 20;

        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(legendX, legendY, 12, 12);

        ctx.fillStyle = "#2c3e50";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        ctx.fillText(label, legendX + 18, legendY + 9);
      });

      // Título
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        data.title || "Gráfico Prova X Trabalho",
        canvas.width / 2,
        25
      );
    }

    // Gráfico de barras comparativas (prova vs trabalho)
    if (type === "comparison" && data.labels && data.datasets) {
      const maxValue = Math.max(...data.datasets.flatMap((d) => d.values));
      const groupWidth = chartWidth / data.labels.length;
      const barWidth = (groupWidth / data.datasets.length) * 0.8;

      data.datasets.forEach((dataset, datasetIndex) => {
        const color =
          dataset.color || (datasetIndex === 0 ? "#3498db" : "#e74c3c");

        dataset.values.forEach((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x =
            padding +
            index * groupWidth +
            datasetIndex * barWidth +
            groupWidth * 0.1;
          const y = padding + chartHeight - barHeight;

          ctx.fillStyle = color;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Valor
          ctx.fillStyle = "#2c3e50";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText(value.toFixed(1), x + barWidth / 2, y - 5);
        });

        // Legenda
        const legendY = padding + chartHeight + 50 + datasetIndex * 18;
        ctx.fillStyle = color;
        ctx.fillRect(padding, legendY, 12, 12);
        ctx.fillStyle = "#2c3e50";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        ctx.fillText(dataset.label, padding + 18, legendY + 9);
      });

      // Labels das matérias
      data.labels.forEach((label, index) => {
        const x = padding + index * groupWidth + groupWidth / 2;
        ctx.fillStyle = "#2c3e50";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.save();
        ctx.translate(x, padding + chartHeight + 25);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      });

      // Título
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        data.title || "Gráfico Prova X Trabalho",
        canvas.width / 2,
        25
      );
    }

    // Gráfico de barras comparando bimestres
    if (type === "bimestral" && data.labels && data.datasets) {
      const maxValue = Math.max(...data.datasets.flatMap((d) => d.values));
      const groupWidth = chartWidth / data.labels.length;
      const barWidth = (groupWidth / data.datasets.length) * 0.8;

      data.datasets.forEach((dataset, datasetIndex) => {
        const colors = ["#3498db", "#e74c3c", "#2ecc71"];
        const color = dataset.color || colors[datasetIndex % colors.length];

        dataset.values.forEach((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x =
            padding +
            index * groupWidth +
            datasetIndex * barWidth +
            groupWidth * 0.1;
          const y = padding + chartHeight - barHeight;

          ctx.fillStyle = color;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Valor
          ctx.fillStyle = "#2c3e50";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText(value.toFixed(1), x + barWidth / 2, y - 5);
        });

        // Legenda
        const legendY = padding + chartHeight + 50 + datasetIndex * 18;
        ctx.fillStyle = color;
        ctx.fillRect(padding, legendY, 12, 12);
        ctx.fillStyle = "#2c3e50";
        ctx.font = "12px Arial";
        ctx.textAlign = "left";
        ctx.fillText(dataset.label, padding + 18, legendY + 9);
      });

      // Labels das matérias
      data.labels.forEach((label, index) => {
        const x = padding + index * groupWidth + groupWidth / 2;
        ctx.fillStyle = "#2c3e50";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.save();
        ctx.translate(x, padding + chartHeight + 25);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      });

      // Título
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(data.title || "Comparação Bimestral", canvas.width / 2, 25);
    }

    // Heatmap de correlação entre matérias
    if (type === "heatmap" && data.matrix && data.labels) {
      const cellSize = Math.min(chartWidth, chartHeight) / data.labels.length;
      const startX = padding + (chartWidth - cellSize * data.labels.length) / 2;
      const startY =
        padding + (chartHeight - cellSize * data.labels.length) / 2;

      // Encontrar min e max para normalização
      const values = data.matrix.flat();
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);

      // Desenhar células do heatmap
      data.matrix.forEach((row, i) => {
        row.forEach((value, j) => {
          const x = startX + j * cellSize;
          const y = startY + i * cellSize;

          // Normalizar valor para cor (0-1)
          const normalizedValue = (value - minVal) / (maxVal - minVal);

          // Cor baseada no valor (azul fraco para vermelho forte)
          const red = Math.floor(255 * normalizedValue);
          const blue = Math.floor(255 * (1 - normalizedValue));
          ctx.fillStyle = `rgb(${red}, 50, ${blue})`;

          ctx.fillRect(x, y, cellSize, cellSize);

          // Borda
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);

          // Valor na célula
          ctx.fillStyle = normalizedValue > 0.5 ? "#ffffff" : "#000000";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            value.toFixed(2),
            x + cellSize / 2,
            y + cellSize / 2 + 3
          );
        });
      });

      // Labels das matérias (eixo X)
      data.labels.forEach((label, index) => {
        const x = startX + index * cellSize + cellSize / 2;
        ctx.fillStyle = "#2c3e50";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.save();
        ctx.translate(x, startY - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(label, 0, 0);
        ctx.restore();
      });

      // Labels das matérias (eixo Y)
      data.labels.forEach((label, index) => {
        const y = startY + index * cellSize + cellSize / 2;
        ctx.fillStyle = "#2c3e50";
        ctx.font = "10px Arial";
        ctx.textAlign = "right";
        ctx.fillText(label, startX - 5, y + 3);
      });

      // Título
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(data.title || "Heatmap de Correlação", canvas.width / 2, 25);
    }

    // Gráfico de dispersão
    if (type === "scatter" && data.points) {
      const xValues = data.points.map((p) => p.x);
      const yValues = data.points.map((p) => p.y);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);

      // Desenhar pontos
      data.points.forEach((point) => {
        const x = padding + ((point.x - minX) / (maxX - minX)) * chartWidth;
        const y =
          padding +
          chartHeight -
          ((point.y - minY) / (maxY - minY)) * chartHeight;

        ctx.fillStyle = point.color || "#3498db";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Label do ponto se disponível
        if (point.label) {
          ctx.fillStyle = "#2c3e50";
          ctx.font = "8px Arial";
          ctx.textAlign = "center";
          ctx.fillText(point.label, x, y - 8);
        }
      });

      // Eixos
      ctx.strokeStyle = "#2c3e50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, padding + chartHeight);
      ctx.lineTo(padding + chartWidth, padding + chartHeight);
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, padding + chartHeight);
      ctx.stroke();

      // Labels dos eixos
      ctx.fillStyle = "#2c3e50";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        data.xLabel || "X",
        padding + chartWidth / 2,
        padding + chartHeight + 30
      );
      ctx.save();
      ctx.translate(15, padding + chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(data.yLabel || "Y", 0, 0);
      ctx.restore();

      // Título
      ctx.fillStyle = "#2c3e50";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(data.title || "Dispersão", canvas.width / 2, 25);
    }

    // Aguardar renderização
    await new Promise((resolve) => setTimeout(resolve, 100));

    return canvas.toDataURL("image/png", 1.0);
  } catch (error) {
    console.warn("Erro ao gerar gráfico:", error);
    return null;
  }
};

export const handleDownloadRelatorio = async (onProgress = null) => {
  // Callback para atualizar progresso se fornecido
  const updateProgress = (message) => {
    if (onProgress && typeof onProgress === "function") {
      onProgress(message);
    }
    console.log(message);
  };

  updateProgress("Carregando dados básicos...");
  // Buscar dados da API
  const alunos = await getAllAlunos();
  const todasNotas = await notasAPI.getAllNotas();
  const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();

  const materias = [
    "Matematica",
    "Portugues",
    "Historia",
    "Geografia",
    "Ciencias",
    "Artes",
  ];

  // Gerar análises de IA para todas as matérias
  updateProgress("Gerando análises de IA para matérias...");
  const analisesMateria = {};
  for (let i = 0; i < materias.length; i++) {
    const materia = materias[i];
    updateProgress(`Analisando ${materia} (${i + 1}/${materias.length})...`);
    try {
      const analise = await buildMateriaAiAnalysis(materia);

      // Manter os textos da IA originais, sem limpeza
      let analiseLimpa = {
        summary:
          analise.summary || `Análise de ${materia}: Dados em processamento.`,
        comment:
          analise.comment || "Análise detalhada será disponibilizada em breve.",
      };

      // Verificar apenas se está vazio, não aplicar limpeza agressiva
      if (!analiseLimpa.summary || analiseLimpa.summary.length < 10) {
        console.warn(`Análise IA vazia para ${materia}, usando fallback`);

        // Calcular dados para fallback apenas se necessário
        const notasMateria = todasNotas.filter(
          (nota) => nota.avaliacao && nota.avaliacao.materia === materia
        );
        const media =
          notasMateria.length > 0
            ? (
              notasMateria.reduce((sum, n) => sum + n.nota, 0) /
              notasMateria.length
            ).toFixed(2)
            : 0;
        const alunosUnicos = [...new Set(notasMateria.map((n) => n.aluno_id))];
        const alunosAprovados = alunosUnicos.filter((alunoId) => {
          const notasAluno = notasMateria.filter((n) => n.aluno_id === alunoId);
          const mediaAluno =
            notasAluno.reduce((sum, n) => sum + n.nota, 0) / notasAluno.length;
          return mediaAluno >= 6;
        }).length;
        const percentualAprovacao =
          alunosUnicos.length > 0
            ? ((alunosAprovados / alunosUnicos.length) * 100).toFixed(1)
            : 0;

        analiseLimpa = gerarAnaliseFallback("materia", materia, {
          media: parseFloat(media),
          totalAlunos: alunosUnicos.length,
          percentualAprovacao: parseFloat(percentualAprovacao),
        });
      }

      analisesMateria[materia] = analiseLimpa;
    } catch (error) {
      console.warn(`Erro ao gerar análise para ${materia}:`, error);
      analisesMateria[materia] = gerarAnaliseFallback("materia", materia);
    }
  }

  // Gerar análises de IA para alunos (limitando para evitar muitas chamadas)
  updateProgress("Gerando análises de IA para alunos...");
  const analisesAluno = {};
  const alunosParaAnalise = alunos.slice(0, 10); // Limitar a 10 alunos para não sobrecarregar
  for (let i = 0; i < alunosParaAnalise.length; i++) {
    const aluno = alunosParaAnalise[i];

    // LIMPAR O NOME DO ALUNO usando a função específica
    const nomeAlunoLimpo = limparNome(aluno.nome);

    updateProgress(
      `Analisando ${nomeAlunoLimpo} (${i + 1}/${alunosParaAnalise.length})...`
    );
    try {
      const analise = await buildAlunoAiAnalysis(aluno.id);

      // Manter os textos da IA originais, sem limpeza
      let analiseLimpa = {
        summary:
          analise.summary ||
          `Análise do aluno ${nomeAlunoLimpo}: Dados em processamento.`,
        comment:
          analise.comment || "Análise detalhada será disponibilizada em breve.",
        nome: nomeAlunoLimpo, // Usar o nome limpo
      };

      // Verificar apenas se está vazio, não aplicar limpeza no texto da IA
      if (!analiseLimpa.summary || analiseLimpa.summary.length < 10) {
        console.warn(
          `Análise IA vazia para ${nomeAlunoLimpo}, usando fallback`
        );

        // Calcular dados para fallback apenas se necessário
        const notasAluno = todasNotas.filter(
          (nota) => nota.aluno_id === aluno.id
        );
        const mediaGeral =
          notasAluno.length > 0
            ? (
              notasAluno.reduce((sum, n) => sum + n.nota, 0) /
              notasAluno.length
            ).toFixed(2)
            : 0;
        const situacao =
          parseFloat(mediaGeral) >= 6 ? "Aprovado" : "Em recuperação";

        analiseLimpa = gerarAnaliseFallback("aluno", nomeAlunoLimpo, {
          mediaGeral: parseFloat(mediaGeral),
          situacao: situacao,
        });
        analiseLimpa.nome = nomeAlunoLimpo;
      }

      analisesAluno[aluno.id] = analiseLimpa;
    } catch (error) {
      console.warn(
        `Erro ao gerar análise para aluno ${nomeAlunoLimpo}:`,
        error
      );
      analisesAluno[aluno.id] = {
        ...gerarAnaliseFallback("aluno", nomeAlunoLimpo),
        nome: nomeAlunoLimpo,
      };
    }

    // In handleDownloadRelatorio function, before using any text:

    // Clean AI analysis text
    Object.keys(analisesMateria).forEach(materia => {
      analisesMateria[materia].summary = limparTextoParaPDF(analisesMateria[materia].summary);
      analisesMateria[materia].comment = limparTextoParaPDF(analisesMateria[materia].comment);
    });

    Object.keys(analisesAluno).forEach(alunoId => {
      analisesAluno[alunoId].summary = limparTextoParaPDF(analisesAluno[alunoId].summary);
      analisesAluno[alunoId].comment = limparTextoParaPDF(analisesAluno[alunoId].comment);
      analisesAluno[alunoId].nome = limparTextoParaPDF(analisesAluno[alunoId].nome);
    });


  }

  updateProgress("Processando estatísticas...");

  // Calcular estatísticas avançadas
  const estatisticasGerais = calculateStats(todasNotas.map((n) => n.nota));

  // Estatísticas por matéria
  const estatisticasMaterias = {};
  const dadosGrafico = { labels: [], values: [], title: "Médias por Matéria" };

  materias.forEach(async (materia) => {
    const notasMateria = todasNotas.filter(
      (nota) => nota.avaliacao && nota.avaliacao.materia === materia
    );

    if (notasMateria.length > 0) {
      const valores = notasMateria.map((n) => n.nota);
      const stats = calculateStats(valores);

      // Calcular alunos aprovados (média >= 6) por matéria
      const alunosUnicos = [...new Set(notasMateria.map((n) => n.aluno_id))];
      let alunosAprovados = 0;

      for (const alunoId of alunosUnicos) {
        const notasDoAluno = notasMateria.filter((n) => n.aluno_id === alunoId);
        const mediaAluno =
          notasDoAluno.reduce((sum, n) => sum + n.nota, 0) /
          notasDoAluno.length;
        if (mediaAluno >= 6) {
          alunosAprovados++;
        }
      }

      const percentualAprovacao = (
        (alunosAprovados / alunosUnicos.length) *
        100
      ).toFixed(1);

      estatisticasMaterias[materia] = {
        ...stats,
        total: valores.length,
        aprovados: alunosAprovados,
        totalAlunos: alunosUnicos.length,
        percentualAprovacao,
      };

      dadosGrafico.labels.push(materia);
      dadosGrafico.values.push(stats.media);
    }
  });

  updateProgress("Gerando gráficos...");
  // Gerar gráfico
  const chartImage = await generateSimpleChart(dadosGrafico, "bar");

  updateProgress("Criando documento PDF...");
  const doc = new jsPDF();
  let y = 20;
  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;

  // ========================= PÁGINA DE CAPA =========================
  doc.setFillColor(41, 128, 185);
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  // Replace the title generation with cleaned text
  doc.text(limparTextoParaPDF("Relatório Educacional Avançado"), pageWidth / 2, y, {
    align: "center",
  });
  y += 5;


  // Clean date text
  const dataGeracao = limparTextoParaPDF(new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }));

  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  y += 2;
  doc.text(`Gerado em: ${dataGeracao}`, pageWidth / 2, y, {
    align: "center",
  });
  y += 2;

  // Estatísticas gerais na capa
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  // Criar caixas de estatísticas em grid 2x3
  const boxWidth = (pageWidth - margin * 2 - 15) / 2; // 2 colunas
  const boxHeight = 25;
  const boxSpacing = 1;

  const estatisticas = [
    { valor: alunos.length, label: "Total de Alunos", cor: [52, 152, 219] },
    { valor: todasNotas.length, label: "Total de Notas", cor: [46, 204, 113] },
    {
      valor: estatisticasGerais.media,
      label: "Média Geral",
      cor: [241, 196, 15],
    },
    {
      valor: estatisticasGerais.mediana,
      label: "Mediana",
      cor: [155, 89, 182],
    },
    {
      valor: estatisticasGerais.desvio,
      label: "Desvio Padrão",
      cor: [230, 126, 34],
    },
    {
      valor: `${estatisticasGerais.minimo} - ${estatisticasGerais.maximo}`,
      label: "Min - Max",
      cor: [231, 76, 60],
    },
  ];

  let boxX = margin;
  let boxY = y;

  estatisticas.forEach((stat, index) => {
    // Calcular posição da caixa (2 colunas)
    const col = index % 2;
    const row = Math.floor(index / 2);

    boxX = margin + col * (boxWidth + boxSpacing);
    boxY = y + row * (boxHeight + boxSpacing);

    // Desenhar caixa com cor específica
    doc.setFillColor(stat.cor[0], stat.cor[1], stat.cor[2]);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, "F");

    // Adicionar borda sutil
    doc.setDrawColor(stat.cor[0] - 20, stat.cor[1] - 20, stat.cor[2] - 20);
    doc.setLineWidth(0.5);
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, "S");

    // Número grande (valor principal)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(String(stat.valor), boxX + boxWidth / 2, boxY + 12, {
      align: "center",
    });

    // Texto descritivo embaixo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(stat.label, boxX + boxWidth / 2, boxY + 20, { align: "center" });
  });

  y += 3 * (boxHeight + boxSpacing) + 10;

  // ========================= ANÁLISE IA DAS ESTATÍSTICAS GERAIS =========================
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  updateProgress("Gerando análise geral das estatísticas...");
  // Buscar análise IA das estatísticas usando função auxiliar
  const analiseEstatisticas = await generateStatsAnalysis(
    estatisticasGerais,
    alunos.length,
    todasNotas.length,
    analisesMateria
  );

  // Formatar o texto da IA adequadamente para PDF
  // Clean statistics analysis
  const textoLimpo = limparTextoParaPDF(analiseEstatisticas || "Análise estatística em processamento.");
  const checkPageBreak = (doc, currentY, requiredSpace = 30) => {
    if (currentY + requiredSpace > 270) {
      doc.addPage();
      return 20;
    }
    return currentY;
  };

  // Use it before adding content sections
  y = checkPageBreak(doc, y, 40);

  // Calcular dimensões baseadas no texto formatado
  const textWidth = pageWidth - margin * 2 - 10;
  const linhasTexto = textoLimpo.split("\n").length;
  const analiseHeight = Math.max(60, linhasTexto * 5 + 25); // Altura baseada no conteúdo formatado

  // Verificar se precisa de nova página
  if (y + analiseHeight > 270) {
    doc.addPage();
    y = 20;

    // Repetir o título na nova página
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Análise IA das Estatísticas (continuação):", margin, y);
    y += 15;
  }

  // Criar caixa para a análise IA
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, pageWidth - margin * 2, analiseHeight, 3, 3, "FD");

  // Ícone do cérebro (IA)
  try {
    const cerebroBase64 = await imageToBase64(cerebroIcon);
    doc.addImage(cerebroBase64, "PNG", margin + 3, y + 3, 10, 10);
  } catch (error) {
    console.warn(
      "Erro ao carregar imagem do cérebro, usando ícone padrão:",
      error
    );
    // Fallback para o círculo original
    doc.setFillColor(74, 144, 226);
    doc.circle(margin + 8, y + 8, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("IA", margin + 8, y + 10, { align: "center" });
  }

  // Título da análise
  doc.setTextColor(74, 144, 226);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Análise Inteligente dos Dados Educacionais:", margin + 18, y + 8);

  // Texto da análise IA
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9); // Fonte ligeiramente menor para caber mais texto

  // Usar texto justificado
  const textX = margin + 5; // Posição X do texto
  const textY = y + 18; // Posição Y do texto

  // Renderizar todo o texto formatado usando a nova função
  renderTextoFormatado(doc, textoLimpo, textX, textY, textWidth, 4.5);

  y += analiseHeight + 15;

  // ========================= SEÇÃO DE GRÁFICOS IMPORTANTES =========================
  // Nova página para gráficos
  doc.addPage();
  y = 20;

  // Definir dimensões dos gráficos para layout 2x2
  const chartWidthSide = 90; // Largura mais proporcional
  const chartHeightSide = 70; // Altura aumentada para melhor proporção
  const spacing = 1; // Espaçamento reduzido entre gráficos

  // Cabeçalho da seção de gráficos
  doc.setFillColor(155, 89, 182);
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Gráficos Importantes", pageWidth / 2, y, {
    align: "center",
  });
  y += 25;

  // ========================= PREPARAR DADOS DE DISTRIBUIÇÃO =========================
  // Análise de distribuição (movido para cá para ser usado nos gráficos)
  const distribuicao = {
    "Excelente (9-10)": 0,
    "Bom (7-8.9)": 0,
    "Satisfatório (6-6.9)": 0,
    "Insatisfatório (4-5.9)": 0,
    "Ruim (0-3.9)": 0,
  };

  todasNotas.forEach((nota) => {
    if (nota.nota >= 9) distribuicao["Excelente (9-10)"]++;
    else if (nota.nota >= 7) distribuicao["Bom (7-8.9)"]++;
    else if (nota.nota >= 6) distribuicao["Satisfatório (6-6.9)"]++;
    else if (nota.nota >= 4) distribuicao["Insatisfatório (4-5.9)"]++;
    else distribuicao["Ruim (0-3.9)"]++;
  });

  // Calcular posições para layout 2x2
  const leftColX = margin + 5; // Margem esquerda otimizada
  const rightColX = margin + chartWidthSide + spacing + 12; // Coluna direita com espaçamento reduzido
  const topRowY = y;
  const bottomRowY = y + chartHeightSide + spacing + 15; // Espaçamento vertical reduzido

  // ========================= GRÁFICO 1: Médias por Matéria (SUPERIOR ESQUERDO) =========================
  if (chartImage) {
    // Adicionar gráfico
    doc.addImage(
      chartImage,
      "PNG",
      leftColX,
      topRowY,
      chartWidthSide,
      chartHeightSide
    );
  }

  // ========================= GRÁFICO 2: Prova vs Trabalho =========================
  // Preparar dados de comparação prova vs trabalho
  const provaTrabalhoData = {
    labels: materias,
    datasets: [
      { label: "Prova", values: [], color: "#3498db" },
      { label: "Trabalho", values: [], color: "#e74c3c" },
    ],
  };

  materias.forEach((materia) => {
    const notasProva = todasNotas.filter(
      (nota) =>
        nota.avaliacao &&
        nota.avaliacao.materia === materia &&
        nota.avaliacao.tipo === "Prova"
    );
    const notasTrabalho = todasNotas.filter(
      (nota) =>
        nota.avaliacao &&
        nota.avaliacao.materia === materia &&
        nota.avaliacao.tipo === "Trabalho"
    );

    const mediaProva =
      notasProva.length > 0
        ? notasProva.reduce((sum, n) => sum + n.nota, 0) / notasProva.length
        : 0;
    const mediaTrabalho =
      notasTrabalho.length > 0
        ? notasTrabalho.reduce((sum, n) => sum + n.nota, 0) /
        notasTrabalho.length
        : 0;

    provaTrabalhoData.datasets[0].values.push(mediaProva);
    provaTrabalhoData.datasets[1].values.push(mediaTrabalho);
  });

  const comparisonChart = await generateSimpleChart(
    provaTrabalhoData,
    "comparison"
  );

  if (comparisonChart) {
    doc.addImage(
      comparisonChart,
      "PNG",
      rightColX,
      topRowY,
      chartWidthSide,
      chartHeightSide
    );
  }

  // ========================= GRÁFICO 3: Pizza - Distribuição de Notas (INFERIOR ESQUERDO) =========================
  // Preparar dados do gráfico de pizza usando a distribuição já calculada
  const pizzaData = {
    labels: Object.keys(distribuicao),
    values: Object.values(distribuicao),
    title: "Distribuição de Notas",
  };

  const pizzaChart = await generateSimpleChart(pizzaData, "pie");

  if (pizzaChart) {
    doc.addImage(
      pizzaChart,
      "PNG",
      leftColX,
      bottomRowY,
      chartWidthSide,
      chartHeightSide
    );
  }

  // ========================= GRÁFICO 4: Comparação Bimestral (INFERIOR DIREITO) =========================
  // Preparar dados de comparação por bimestre
  const bimestralData = {
    labels: materias,
    datasets: [
      { label: "Bimestre 1", values: [], color: "#3498db" },
      { label: "Bimestre 2", values: [], color: "#e74c3c" },
      { label: "Bimestre 3", values: [], color: "#2ecc71" },
    ],
  };

  // Calcular médias por matéria e bimestre
  materias.forEach((materia) => {
    for (let bimestre = 1; bimestre <= 3; bimestre++) {
      const notasBimestre = todasNotas.filter(
        (nota) =>
          nota.avaliacao &&
          nota.avaliacao.materia === materia &&
          nota.avaliacao.bimestre === bimestre
      );

      const media =
        notasBimestre.length > 0
          ? notasBimestre.reduce((sum, n) => sum + n.nota, 0) /
          notasBimestre.length
          : 0;

      bimestralData.datasets[bimestre - 1].values.push(media);
    }
  });

  const bimestralChart = await generateSimpleChart(bimestralData, "bimestral");

  if (bimestralChart) {
    doc.addImage(
      bimestralChart,
      "PNG",
      rightColX,
      bottomRowY,
      chartWidthSide,
      chartHeightSide
    );
  }

  // ========================= INSIGHTS ESTATÍSTICOS =========================
  doc.addPage();
  y = 20;

  doc.setFillColor(46, 204, 113);
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Insights Estatísticos Avançados", pageWidth / 2, y, {
    align: "center",
  });
  y += 25;

  // Usar a distribuição já calculada anteriormente
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Distribuição de Notas:", margin, y);
  y += 15;

  // Criar caixas para distribuição de notas
  const distBoxWidth = (pageWidth - margin * 2 - 20) / 3; // 3 colunas, 2 linhas
  const distBoxHeight = 22;
  const distSpacing = 5;

  const cores = [
    [46, 204, 113], // Verde - Excelente
    [52, 152, 219], // Azul - Bom
    [241, 196, 15], // Amarelo - Satisfatório
    [230, 126, 34], // Laranja - Insatisfatório
    [231, 76, 60], // Vermelho - Ruim
  ];

  const distribuicaoArray = Object.entries(distribuicao);

  distribuicaoArray.forEach(([faixa, quantidade], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);

    const distBoxX = margin + col * (distBoxWidth + distSpacing);
    const distBoxY = y + row * (distBoxHeight + distSpacing + 5);

    const percentual =
      todasNotas.length > 0
        ? ((quantidade / todasNotas.length) * 100).toFixed(1)
        : "0.0";

    // Caixa principal
    doc.setFillColor(cores[index][0], cores[index][1], cores[index][2]);
    doc.roundedRect(distBoxX, distBoxY, distBoxWidth, distBoxHeight, 3, 3, "F");

    // Quantidade (número grande)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(String(quantidade), distBoxX + distBoxWidth / 2, distBoxY + 10, {
      align: "center",
    });

    // Percentual
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${percentual}%`, distBoxX + distBoxWidth / 2, distBoxY + 18, {
      align: "center",
    });

    // Label da faixa (fora da caixa)
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(faixa, distBoxX + distBoxWidth / 2, distBoxY + distBoxHeight + 8, {
      align: "center",
    });
  });

  y +=
    Math.ceil(distribuicaoArray.length / 3) *
    (distBoxHeight + distSpacing + 15) +
    10;

  // Insights automáticos
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Insights Automáticos:", margin, y);
  y += 10;

  const insights = [];

  if (estatisticasGerais.desvio > 2.5) {
    insights.push(
      `• Alta variabilidade nas notas (desvio padrão: ${estatisticasGerais.desvio})`
    );
  }

  if (estatisticasGerais.media < 6) {
    insights.push(
      `• Média geral abaixo do esperado (${estatisticasGerais.media})`
    );
  }

  // Análise por matéria
  Object.entries(estatisticasMaterias).forEach(([materia, stats]) => {
    if (stats.media < 5) {
      insights.push(
        `• ${materia}: Necessita atenção urgente (média: ${stats.media})`
      );
    }
    if (stats.desvio > 3) {
      insights.push(
        `• ${materia}: Grande variabilidade entre alunos (desvio: ${stats.desvio})`
      );
    }
  });

  // Insights das análises de IA
  const materiasProblematicas = Object.entries(analisesMateria)
    .filter(
      ([materia, analise]) =>
        analise.summary.toLowerCase().includes("necessita atenção") ||
        analise.summary.toLowerCase().includes("regular")
    )
    .map(([materia]) => materia);

  const materiasExcelentes = Object.entries(analisesMateria)
    .filter(([materia, analise]) =>
      analise.summary.toLowerCase().includes("excelente")
    )
    .map(([materia]) => materia);

  if (materiasExcelentes.length > 0) {
    insights.push(
      `• Matérias com desempenho excelente: ${materiasExcelentes.join(", ")}`
    );
  }

  if (materiasProblematicas.length > 0) {
    insights.push(
      `• Matérias que requerem intervenção: ${materiasProblematicas.join(", ")}`
    );
  }

  if (insights.length === 0) {
    insights.push("• Desempenho geral dentro dos padrões esperados");
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  insights.forEach((insight) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(insight, margin + 5, y);
    y += 8;
  });

  // ========================= ANÁLISES DE IA DAS MATÉRIAS =========================
  doc.addPage();
  y = 20;

  doc.setFillColor(155, 89, 182);
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Análises de IA por Matéria", pageWidth / 2, y, {
    align: "center",
  });
  y += 25;

  // Renderizar análises de cada matéria com a nova função
  for (const [materia, analise] of Object.entries(analisesMateria)) {
    // Verificar se precisa de nova página (estimativa conservadora)
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    // Limpar o nome da matéria também
    const nomeMaterieLimpo = limparNome(materia);

    // Título da matéria
    doc.setTextColor(155, 89, 182);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${nomeMaterieLimpo}`, margin, y);
    y += 10;

    // Renderizar análise usando a função auxiliar
    y = renderAiAnalysis(doc, analise, margin, y, pageWidth - margin * 2, {
      header: [155, 89, 182],
      text: [44, 62, 80],
    });

    y += 5; // Espaçamento entre matérias
  }

  // ========================= ANÁLISES DE IA DOS ALUNOS =========================
  doc.addPage();
  y = 20;

  doc.setFillColor(46, 204, 113);
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Análises de IA dos Alunos (Top 10)", pageWidth / 2, y, {
    align: "center",
  });
  y += 25;

  // Renderizar análises dos alunos com a nova função
  for (const [alunoId, analise] of Object.entries(analisesAluno)) {
    // Verificar se precisa de nova página (estimativa conservadora)
    if (y > 200) {
      doc.addPage();
      y = 20;
    }

    // Limpar o nome do aluno antes de renderizar
    const nomeAlunoLimpo = limparNome(analise.nome || "Aluno");

    // Título do aluno
    doc.setTextColor(46, 204, 113);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`👤 ${nomeAlunoLimpo}`, margin, y);
    y += 10;

    // Renderizar análise usando a função auxiliar
    y = renderAiAnalysis(doc, analise, margin, y, pageWidth - margin * 2, {
      header: [46, 204, 113],
      text: [44, 62, 80],
    });

    y += 5; // Espaçamento entre alunos
  }

  // Rodapé com timestamp
  const timestamp = new Date().toLocaleString("pt-BR");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Relatório gerado em: ${timestamp}`, margin, 285);

  updateProgress("Finalizando e salvando o relatório...");
  doc.save(`relatorio-avancado-${new Date().toISOString().split("T")[0]}.pdf`);

  updateProgress("Relatório gerado com sucesso!");
};
