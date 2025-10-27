import jsPDF from "jspdf";
import {
  buildAlunoAiAnalysis,
  buildMateriaAiAnalysis,
} from "../services/aiService";
import { getAllAlunos } from "../services/alunosService";
import { notasAPI, avaliacoesAPI } from "../services/apiService";
import cerebroIcon from "../assets/images/cerebro.webp";

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
const generateStatsAnalysis = async (estatisticas, totalAlunos, totalNotas) => {
  const prompt = `Analise estas estatísticas educacionais e forneça insights importantes em português brasileiro:
  
  - Total de Alunos: ${totalAlunos}
  - Total de Notas Registradas: ${totalNotas}
  - Média Geral da Turma: ${estatisticas.media}
  - Mediana: ${estatisticas.mediana}
  - Desvio Padrão: ${estatisticas.desvio}
  - Nota Mínima: ${estatisticas.minimo}
  - Nota Máxima: ${estatisticas.maximo}
  
  Forneça uma análise breve (máximo 3 parágrafos) sobre o desempenho geral, variabilidade e recomendações. Seja direto e objetivo.`;

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
        "🎯 Desempenho Excelente: Turma com média superior a 8.0, demonstrando domínio dos conteúdos. ";
    } else if (estatisticas.media >= 6) {
      analise +=
        "✅ Desempenho Satisfatório: Média adequada (6.0+) indica aproveitamento esperado. ";
    } else {
      analise +=
        "⚠️ Atenção Necessária: Média baixa requer intervenção pedagógica urgente. ";
    }

    // Análise da variabilidade
    if (estatisticas.desvio <= 1.5) {
      analise +=
        "📊 Turma Homogênea: Baixa variabilidade indica desempenho consistente entre alunos. ";
    } else if (estatisticas.desvio > 2.5) {
      analise += `📊 Alta Variabilidade: Desvio de ${estatisticas.desvio} indica grandes diferenças individuais. `;
    } else {
      analise +=
        "📊 Variabilidade Moderada: Algumas diferenças no desempenho entre alunos. ";
    }

    // Análise da amplitude (mais concisa)
    const amplitude = estatisticas.maximo - estatisticas.minimo;
    if (amplitude > 6) {
      analise += `📈 Amplitude ${amplitude.toFixed(
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
    canvas.width = 400;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");

    // Configurações do gráfico
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

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
      ctx.fillText(data.title || "Gráfico", canvas.width / 2, 25);
    }

    // Aguardar renderização
    await new Promise((resolve) => setTimeout(resolve, 100));

    return canvas.toDataURL("image/png", 1.0);
  } catch (error) {
    console.warn("Erro ao gerar gráfico:", error);
    return null;
  }
};

export const handleDownloadRelatorio = async () => {
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

  // Gerar gráfico
  const chartImage = await generateSimpleChart(dadosGrafico, "bar");

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
  doc.text("Relatório Educacional Avançado", pageWidth / 2, y, {
    align: "center",
  });
  y += 15;

  // Estatísticas gerais na capa
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  // Criar caixas de estatísticas em grid 2x3
  const boxWidth = (pageWidth - margin * 2 - 15) / 2; // 2 colunas
  const boxHeight = 25;
  const boxSpacing = 5;

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

  // Buscar análise IA das estatísticas usando função auxiliar
  const analiseEstatisticas = await generateStatsAnalysis(
    estatisticasGerais,
    alunos.length,
    todasNotas.length
  );

  // Limpar e formatar o texto da análise primeiro para calcular altura
  const textoLimpo = analiseEstatisticas
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/```[^`]*```/g, "") // Remove code blocks
    .replace(/\*\*/g, "") // Remove markdown bold
    .trim();

  // Calcular dimensões do texto
  const textWidth = pageWidth - margin * 2 - 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const linhasAnalise = doc.splitTextToSize(textoLimpo, textWidth);

  // Usar todas as linhas necessárias (sem limite artificial)
  const linhasTexto = linhasAnalise.length;
  const analiseHeight = Math.max(60, 25 + linhasTexto * 4.5); // Altura baseada no conteúdo real

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
  doc.text("Análise Inteligente:", margin + 18, y + 8);

  // Texto da análise IA
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9); // Fonte ligeiramente menor para caber mais texto

  // Usar texto justificado
  const textX = margin + 5; // Posição X do texto
  const textY = y + 18; // Posição Y do texto

  // Renderizar todo o texto sem limitação artificial
  drawJustifiedText(doc, textoLimpo, textX, textY, textWidth, 4.5);

  y += analiseHeight + 15;

  // ========================= PÁGINA DE GRÁFICO =========================
  if (chartImage) {
    doc.addPage();
    y = 20;

    doc.setFillColor(52, 152, 219);
    doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Análise Visual das Matérias", pageWidth / 2, y, {
      align: "center",
    });
    y += 25;

    // Adicionar gráfico
    const imgWidth = 120;
    const imgHeight = 75;
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(chartImage, "PNG", imgX, y, imgWidth, imgHeight);
    y += imgHeight + 15;
  }

  // Estatísticas detalhadas por matéria
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  Object.entries(estatisticasMaterias).forEach(([materia, stats]) => {
    if (y > 180) {
      doc.addPage();
      y = 20;
    }

    // Cabeçalho da matéria
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text(materia, margin + 3, y + 2);
    y += 12;

    // Mini caixas para estatísticas da matéria
    const miniBoxWidth = (pageWidth - margin * 2 - 20) / 3; // 3 colunas
    const miniBoxHeight = 18;

    const statsMateria = [
      { valor: stats.media, label: "Média", cor: [52, 152, 219] },
      {
        valor: `${stats.percentualAprovacao}%`,
        label: "Aprovação",
        cor: [46, 204, 113],
      },
      { valor: stats.desvio, label: "Desvio", cor: [230, 126, 34] },
    ];

    statsMateria.forEach((stat, index) => {
      const miniBoxX = margin + 3 + index * (miniBoxWidth + 5);

      // Caixa colorida
      doc.setFillColor(stat.cor[0], stat.cor[1], stat.cor[2]);
      doc.roundedRect(miniBoxX, y, miniBoxWidth, miniBoxHeight, 2, 2, "F");

      // Valor em branco
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(String(stat.valor), miniBoxX + miniBoxWidth / 2, y + 8, {
        align: "center",
      });

      // Label embaixo
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(stat.label, miniBoxX + miniBoxWidth / 2, y + 15, {
        align: "center",
      });
    });

    // Informações adicionais em texto menor
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Min: ${stats.minimo} | Max: ${stats.maximo} | Total: ${stats.total} notas | Aprovados: ${stats.aprovados}/${stats.totalAlunos} alunos`,
      margin + 3,
      y + 25
    );

    y += 35;
  });

  // ========================= ANÁLISES IA - ALUNOS =========================
  doc.addPage();
  y = 20;

  doc.setFillColor(41, 128, 185);
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Análises IA - Desempenho Individual", pageWidth / 2, y, {
    align: "center",
  });
  y += 25;

  // Processar alunos sequencialmente para aguardar análises IA
  for (const aluno of alunos) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(230, 240, 255);
    doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 55, 3, 3, "F");
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${aluno.nome}`, margin + 3, y + 3);

    // Estatísticas rápidas do aluno
    const notasAluno = todasNotas.filter((nota) => nota.aluno_id === aluno.id);
    const statsAluno = calculateStats(notasAluno.map((n) => n.nota));

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Média: ${statsAluno.media} | Mediana: ${statsAluno.mediana} | Desvio: ${statsAluno.desvio}`,
      margin + 3,
      y + 10
    );

    // Análise IA
    const analysis = await buildAlunoAiAnalysis(aluno.id || aluno.nome);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    let lines = doc.splitTextToSize(analysis.summary, maxWidth - 6);
    doc.text(lines, margin + 3, y + 18);

    let commentLines = [];
    analysis.comment.split("<br>").forEach((c) => {
      const cleanLine = c.replace(/<[^>]+>/g, "").trim();
      if (cleanLine) {
        commentLines = commentLines.concat(
          doc.splitTextToSize(cleanLine, maxWidth - 6)
        );
      }
    });
    doc.setFont("helvetica", "italic");
    doc.setTextColor(52, 73, 94);
    doc.text(commentLines, margin + 3, y + 25 + lines.length * 5);

    y += 35 + (lines.length + commentLines.length - 1) * 5;
  }

  // ========================= ANÁLISES IA - MATÉRIAS =========================
  doc.addPage();
  y = 20;

  doc.setFillColor(230, 126, 34);
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Análises IA - Desempenho por Matéria", pageWidth / 2, y, {
    align: "center",
  });
  y += 25;

  // Processar matérias sequencialmente para aguardar análises IA
  for (const materia of materias) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(255, 245, 225);
    doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 60, 3, 3, "F");
    doc.setTextColor(211, 84, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${materia}`, margin + 3, y + 3);

    // Estatísticas da matéria
    const stats = estatisticasMaterias[materia];
    if (stats) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Média: ${stats.media} | Aprovação: ${stats.percentualAprovacao}% | Desvio: ${stats.desvio}`,
        margin + 3,
        y + 10
      );
    }

    const analysis = await buildMateriaAiAnalysis(materia);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    let lines = doc.splitTextToSize(analysis.summary, maxWidth - 6);
    doc.text(lines, margin + 3, y + 18);

    let commentLines = [];
    analysis.comment.split("<br>").forEach((c) => {
      const cleanLine = c.replace(/<[^>]+>/g, "").trim();
      if (cleanLine) {
        commentLines = commentLines.concat(
          doc.splitTextToSize(cleanLine, maxWidth - 6)
        );
      }
    });
    doc.setFont("helvetica", "italic");
    doc.setTextColor(52, 73, 94);
    doc.text(commentLines, margin + 3, y + 25 + lines.length * 5);

    y += 40 + (lines.length + commentLines.length - 1) * 5;
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

  // Análise de distribuição
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

  // Rodapé com timestamp
  const timestamp = new Date().toLocaleString("pt-BR");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Relatório gerado em: ${timestamp}`, margin, 285);

  doc.save(`relatorio-avancado-${new Date().toISOString().split("T")[0]}.pdf`);
};
