import { getAlunoByName } from "./services/alunosService.js";
import {
  getNotasByAluno,
  getMediaByAlunoForEachMateria,
  getMediaForEachAluno,
  getMediaByAlunoBimestreAndTipoForEachMateria,
  getMediaByAlunoBimestreForEachMateria,
  getMediaByAlunoAndTipoForEachMateria,
  getMediaByAlunoForEachMateriaAndBimestre,
  getMediaByAlunoAndTipoForEachMateriaAndBimestre,
  getMediaByAlunoAndMateriaForEachBimestre,
  getMediaByAlunoTipoAndMateriaForEachBimestre,
  getMediaAvaliacaoByTipoAndBimestreForEachMateria,
  getMediaAvaliacaoByBimestreForEachMateria,
  getMediaAvaliacaoByMateriaAndTipoForEachBimestre,
  getMediaAvaliacaoForEachMateria,
  getMediaAvaliacaoByTipoForEachMateria
} from "./services/notasService.js";
import { buildAlunoAiAnalysis } from "./aiAnalysis.js";
import { renderComparacaoTurmaChart, renderEvolucaoNotasChart } from "./charts.js";


function getAlunoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("aluno");
}
const alunoNome = getAlunoFromUrl();
const alunoObj = getAlunoByName(alunoNome);
const title = document.getElementById("aluno-title");
if (alunoObj) {
  title.textContent = alunoObj;
} else {
  title.textContent = "Aluno não encontrado";
}

const faltasTotais = Math.floor(Math.random() * 20);
document.getElementById("faltas-totais").textContent = faltasTotais + " faltas";

const notasAluno = getNotasByAluno(alunoObj?.nome || alunoNome);
const mediasMaterias = getMediaByAlunoForEachMateria(alunoObj?.nome || alunoNome);
const mediasList = document.getElementById("medias-materias-list");
Object.entries(mediasMaterias).forEach(([materia, media]) => {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = `${materia}: ${media}`;
  mediasList.appendChild(li);
});

const mediaTurma = getMediaAvaliacaoForEachMateria()
let comparacaoTurmaChart = renderComparacaoTurmaChart(mediasMaterias, mediaTurma);

const evolucaoNotasData = getMediaByAlunoForEachMateriaAndBimestre(alunoNome);
let evolucaoNotasChart = renderEvolucaoNotasChart(evolucaoNotasData);

document.addEventListener("DOMContentLoaded", () => {

  calcularRankingAluno();

  renderTabelaAprovacao();

  const aiSummary = document.getElementById("ai-summary");
  const aiComment = document.getElementById("ai-comment");
  if (aiSummary && aiComment && alunoObj) {
    const aiAnalysis = buildAlunoAiAnalysis(alunoNome);
    aiSummary.textContent = aiAnalysis.summary;
    aiComment.innerHTML = aiAnalysis.comment;
  }
});

window.applyFilters = function () {
  const materia = document.getElementById("filtro-materia").value;
  const bimestre = document.getElementById("filtro-bimestre").value;
  const tipo = document.getElementById("filtro-tipo").value;

  const chartCtx = document.getElementById("evolucao-notas-chart").getContext("2d");

  let [notasFiltradas, notasTurma] = filterNotasForComparacaoTurma(materia, bimestre, tipo);

  console.log(notasFiltradas);
  comparacaoTurmaChart.destroy();
  comparacaoTurmaChart = renderComparacaoTurmaChart(notasFiltradas, notasTurma);

  let notasEvolucaoFiltradas = filterNotasForEvolucaoNotas(materia, tipo);

  evolucaoNotasChart.destroy();
  evolucaoNotasChart = renderEvolucaoNotasChart(notasEvolucaoFiltradas);

};

const filterNotasForComparacaoTurma = (materia, bimestre, tipo) => {
  let notasFiltradas = notasAluno?.notas || [];
  let notasTurma = [];

  const filters = [
    {
      condicion: () => materia === "All" && bimestre !== "All" && tipo !== "All",
      mediaAluno: () => getMediaByAlunoBimestreAndTipoForEachMateria(alunoNome, Number(bimestre), tipo),
      mediaTurma: () => getMediaAvaliacaoByTipoAndBimestreForEachMateria(tipo, Number(bimestre)),
    },
    {
      condicion: () => materia === "All" && bimestre !== "All" && tipo === "All",
      mediaAluno: () => getMediaByAlunoBimestreForEachMateria(alunoNome, Number(bimestre)),
      mediaTurma: () => getMediaAvaliacaoByBimestreForEachMateria(Number(bimestre)),
    },
    {
      condicion: () => materia === "All" && bimestre === "All" && tipo !== "All",
      mediaAluno: () => getMediaByAlunoAndTipoForEachMateria(alunoNome, tipo),
      mediaTurma: () => getMediaAvaliacaoByTipoForEachMateria(tipo),
    }
  ];

  for (const { condicion, mediaAluno, mediaTurma } of filters) {
    if (condicion()) {
      notasFiltradas = mediaAluno();
      notasTurma = mediaTurma();
      break;
    } else {
      notasFiltradas = getMediaByAlunoForEachMateria(alunoNome);
      notasTurma = getMediaAvaliacaoForEachMateria();
    }
  }
  return [notasFiltradas, notasTurma];
}

const filterNotasForEvolucaoNotas = (materia, tipo) => {
  let notasFiltradas = notasAluno?.notas || [];

  const filters = [
    {
      condicion: () => materia === "All" && tipo !== "All",
      fn: () => getMediaByAlunoAndTipoForEachMateriaAndBimestre(alunoNome, materia),
    },
    {
      condicion: () => materia !== "All" && tipo === "All",
      fn: () => getMediaByAlunoAndMateriaForEachBimestre(alunoNome, materia, tipo),
    },
    {
      condicion: () => materia !== "All" && tipo !== "All",
      fn: () => getMediaByAlunoTipoAndMateriaForEachBimestre(alunoNome, materia, tipo),
    },
  ];

  for (const { condicion, fn } of filters) {
    if (condicion()) {
      notasFiltradas = fn();
      break;
    } else {
      notasFiltradas = getMediaByAlunoForEachMateriaAndBimestre(alunoNome);
    }
  }
  return notasFiltradas;
}

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
  Object.entries(mediasMaterias).forEach(([materia, media]) => {
    const aprovado = media >= 6;
    html += `<tr>
            <td>${materia}</td>
            <td>${media}</td>
            <td style="color:${aprovado ? "#1976d2" : "#d32f2f"
      };font-weight:bold;">${aprovado ? "Aprovado" : "Reprovado"}</td>
        </tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

function calcularRankingAluno() {
  const mediasAlunos = getMediaForEachAluno();
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

function renderDistribuicaoNotasChart() {

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
}

renderDistribuicaoNotasChart();
