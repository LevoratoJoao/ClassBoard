import jsPDF from "jspdf";
import {
  buildAlunoAiAnalysis,
  buildMateriaAiAnalysis,
} from "../services/aiService";
import { getAllAlunos } from "../services/alunosService";

export const handleDownloadRelatorio = async () => {
  // Buscar alunos da API
  const alunos = await getAllAlunos();
  const materias = [
    "Matematica",
    "Portugues",
    "Historia",
    "Geografia",
    "Ciencias",
    "Artes",
  ];

  const doc = new jsPDF();
  let y = 20;
  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;

  doc.setFillColor(41, 128, 185); // blue
  doc.rect(margin, y - 10, pageWidth - margin * 2, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Relatório de Análises IA", pageWidth / 2, y, { align: "center" });
  y += 18;

  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text("Análise por Aluno:", margin, y);
  y += 8;

  // Processar alunos sequencialmente para aguardar análises IA
  for (const aluno of alunos) {
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 47, 3, 3, "F");
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Aluno: ${aluno.nome}`, margin + 3, y + 3);

    // Usar ID do aluno para análise IA (se disponível)
    const analysis = await buildAlunoAiAnalysis(aluno.id || aluno.nome);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let lines = doc.splitTextToSize(
      `Resumo: ${analysis.summary}`,
      maxWidth - 6
    );
    doc.text(lines, margin + 3, y + 10);

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
    doc.text(commentLines, margin + 3, y + 17 + lines.length * 5);

    y += 30 + (lines.length + commentLines.length - 2) * 5;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  }

  doc.setFontSize(14);
  doc.setTextColor(41, 128, 185);
  doc.text("Análise por Matéria:", margin, y);
  y += 8;

  // Processar matérias sequencialmente para aguardar análises IA
  for (const materia of materias) {
    doc.setFillColor(255, 245, 225);
    doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 52, 3, 3, "F");
    doc.setTextColor(211, 84, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Matéria: ${materia}`, margin + 3, y + 3);

    const analysis = await buildMateriaAiAnalysis(materia);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    let lines = doc.splitTextToSize(
      `Resumo: ${analysis.summary}`,
      maxWidth - 6
    );
    doc.text(lines, margin + 3, y + 10);

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
    doc.text(commentLines, margin + 3, y + 17 + lines.length * 5);

    y += 30 + (lines.length + commentLines.length - 2) * 5;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  }

  doc.save("relatorio-ia.pdf");
};
