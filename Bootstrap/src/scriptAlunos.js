import { alunos } from "./data/alunos.js";
import { notas } from "./data/notas.js";
import { buildAiAnalysis } from "./charts.js";

function getAlunoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("aluno");
}
const alunoNome = getAlunoFromUrl();
const alunoObj = alunos.find((a) => a.nome === alunoNome);
const title = document.getElementById("aluno-title");
if (alunoObj) {
  title.textContent = alunoObj.nome;
} else {
  title.textContent = "Aluno não encontrado";
}

const faltasTotais = Math.floor(Math.random() * 20);
document.getElementById("faltas-totais").textContent = faltasTotais + " faltas";

const notasAluno = notas.find((n) => n.aluno === alunoObj?.nome || alunoNome);
const mediasMaterias = {};

notasAluno?.notas.forEach((notaObj) => {
  if (!mediasMaterias[notaObj.avaliacao.materia])
    mediasMaterias[notaObj.avaliacao.materia] = [];
  mediasMaterias[notaObj.avaliacao.materia].push(notaObj.nota);
});
const mediasList = document.getElementById("medias-materias-list");
Object.entries(mediasMaterias).forEach(([materia, notasArr]) => {
  const media = (notasArr.reduce((a, b) => a + b, 0) / notasArr.length).toFixed(
    2
  );
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = `${materia}: ${media}`;
  mediasList.appendChild(li);
});

const mediasTurma = {};
notas.forEach((n) => {
  n.notas.forEach((notaObj) => {
    if (!mediasTurma[notaObj.avaliacao.materia])
      mediasTurma[notaObj.avaliacao.materia] = [];
    mediasTurma[notaObj.avaliacao.materia].push(notaObj.nota);
  });
});
const materias = Object.keys(mediasMaterias);
const alunoMedias = materias.map((m) =>
  (
    mediasMaterias[m].reduce((a, b) => a + b, 0) / mediasMaterias[m].length
  ).toFixed(2)
);
const turmaMedias = materias.map((m) =>
  (mediasTurma[m].reduce((a, b) => a + b, 0) / mediasTurma[m].length).toFixed(2)
);
const mediaAprovacao = 6;
const comparacaoChart = new Chart(
  document.getElementById("comparacao-turma-chart").getContext("2d"),
  {
    type: "bar",
    data: {
      labels: materias,
      datasets: [
        {
          label: "Aluno",
          data: alunoMedias,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
        {
          label: "Turma",
          data: turmaMedias,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false },
      },
      layout: {
        padding: {
          left: 1,
          right: 1,
        },
      },
    },
    plugins: [
      {
        id: "linhaAprovacao",
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          const yScale = chart.scales["y"];
          const xScale = chart.scales["x"];
          if (!yScale || !xScale) return;
          const y = yScale.getPixelForValue(mediaAprovacao);
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([10, 5]);
          ctx.strokeStyle = "#1976d2";
          ctx.lineWidth = 3;
          ctx.moveTo(xScale.left, y);
          ctx.lineTo(xScale.right, y);
          ctx.stroke();
          ctx.restore();
        },
      },
    ],
  }
);

document.addEventListener("DOMContentLoaded", () => {
  const filtroMateria = document.getElementById("filtro-materia");
  Object.keys(mediasMaterias).forEach((materia) => {
    const opt = document.createElement("option");
    opt.value = materia;
    opt.textContent = materia;
    filtroMateria.appendChild(opt);
  });

  calcularRankingAluno();

  function renderTabelaAprovacao() {
    const container = document.getElementById("tabela-aprovacao-anual");
    if (!container) return;
    let html = `<table class="table table-bordered table-sm" style="margin-top:12px;">
        <thead>
            <tr>
                <th class="montserrat" style="font-weight:500;">Matéria</th>
                <th class="montserrat" style="font-weight:500;">Média anual</th>
                <th class="montserrat" style="font-weight:500;">Situação</th>
            </tr>
        </thead>
        <tbody>`;
    Object.entries(mediasMaterias).forEach(([materia, notasArr]) => {
      const media = notasArr.length
        ? notasArr.reduce((a, b) => a + b, 0) / notasArr.length
        : 0;
      const aprovado = media >= 6;
      html += `<tr>
            <td>${materia}</td>
            <td>${media.toFixed(2)}</td>
            <td style="color:${
              aprovado ? "#1976d2" : "#d32f2f"
            };font-weight:bold;">${aprovado ? "Aprovado" : "Reprovado"}</td>
        </tr>`;
    });
    html += "</tbody></table>";
    container.innerHTML = html;
  }

  renderTabelaAprovacao();

  if (
    document.getElementById("evolucao-notas-chart") &&
    notasAluno &&
    Object.keys(mediasMaterias).length > 0
  ) {
    renderEvolucaoNotasChart();
  }

  if (
    document.getElementById("distribuicao-notas-chart") &&
    notasAluno &&
    notasAluno.notas.length > 0
  ) {
    renderDistribuicaoNotasChart();
  }

  const aiSummary = document.getElementById("ai-summary");
  const aiComment = document.getElementById("ai-comment");
  if (aiSummary && aiComment && alunoObj) {
    const aiAnalysis = buildAiAnalysis(alunoObj.nome);
    aiSummary.textContent = aiAnalysis.summary;
    aiComment.innerHTML = aiAnalysis.comment;
  }
});

function renderEvolucaoNotasChart() {
  // Agrupa notas por matéria e ordena por bimestre
  const materias = Object.keys(mediasMaterias);
  // Descobre todos os bimestres presentes nas notas
  const bimestresSet = new Set();
  notasAluno?.notas.forEach((notaObj) => {
    bimestresSet.add(notaObj.avaliacao.bimestre);
  });
  const bimestres = Array.from(bimestresSet).sort((a, b) => a - b);
  const colors = [
    "rgba(54, 162, 235, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];
  const datasets = materias.map((materia, idx) => {
    // Para cada bimestre, pega a nota da matéria
    const notasPorBimestre = bimestres.map((bim) => {
      const notaObj = notasAluno?.notas.find(
        (n) => n.avaliacao.materia === materia && n.avaliacao.bimestre == bim
      );
      return notaObj ? notaObj.nota : null;
    });
    return {
      label: materia,
      data: notasPorBimestre,
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length],
      fill: false,
      tension: 0.2,
    };
  });
  const ctx = document.getElementById("evolucao-notas-chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: bimestres.map((b) => `${b}º Bimestre`),
      datasets: datasets,
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
        },
      },
    },
  });
}
renderEvolucaoNotasChart();

function calcularRankingAluno() {
  const mediasAlunos = notas.map((n) => {
    const todasNotas = n.notas.map((obj) => obj.nota);
    const media = todasNotas.length
      ? todasNotas.reduce((a, b) => a + b, 0) / todasNotas.length
      : 0;
    return { aluno: n.aluno, media };
  });
  //    consoleeeeeee
  mediasAlunos.forEach(({ aluno, media }) => {
    console.log(`Aluno: ${aluno} | Média: ${media.toFixed(2)}`);
  });
  mediasAlunos.sort((a, b) => b.media - a.media);

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();
  }
  const nomeAtual = normalize(alunoObj?.nome || alunoNome || "");
  const posicao = mediasAlunos.findIndex(
    (a) => normalize(a.aluno) === nomeAtual
  );
  const rankingSpan = document.getElementById("ranking-aluno");
  if (rankingSpan) {
    if (posicao >= 0) {
      rankingSpan.textContent = `${posicao + 1}º de ${mediasAlunos.length}`;
    }
  }
}

const todasNotas = notasAluno.notas.map((obj) => obj.nota);

const bins = Array(11).fill(0);
todasNotas.forEach((nota) => {
  if (typeof nota === "number" && nota >= 0 && nota <= 10) {
    bins[Math.round(nota)]++;
  }
});
const ctx = document
  .getElementById("distribuicao-notas-chart")
  .getContext("2d");

const baseColor = "31, 118, 210"; // RGB do #1976d2
const gradientColors = Array.from(
  { length: 11 },
  (_, i) => `rgba(${baseColor}, ${1 - i * 0.08})`
);
new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: bins.map((_, i) => i.toString()),
    datasets: [
      {
        label: "Frequência das notas",
        data: bins,
        backgroundColor: gradientColors,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
  },
});
