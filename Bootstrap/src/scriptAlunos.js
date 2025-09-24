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
  getMediaAvaliacaoForEachMateria,
  getMediaAvaliacaoByTipoForEachMateria,
  getNotasByAlunoMateriaAndBimestre,
  getNotasByAlunoMateriaAndTipo,
  getNotasByAlunoMateriaTipoAndBimestre,
  getNotasByAlunoBimestreAndTipo,
  getNotasByAlunoAndBimestre,
  getNotasByAlunoAndTipo,
  getNotasByAlunoAndMateria,
  getMediaByMateria,
  getMediaByMateriaAndBimestre,
  getMediaByMateriaAndTipo,
  getMediaByMateriaTipoAndBimestre,
  getMediaByAlunoAndMateria,
  getMediaByAlunoMateriaAndBimestre,
  getMediaByAlunoMateriaAndTipo,
  getMediaByAlunoMateriaTipoAndBimestre,
  getMediaByAlunoMateriaAndTipoForEachBimestre,
} from "./services/notasService.js";
import { buildAlunoAiAnalysis } from "./aiAnalysis.js";
import {
  renderComparacaoTurmaChart,
  renderEvolucaoNotasChart,
  renderDistribuicaoNotasChart,
} from "./charts.js";

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

const mediasMaterias = getMediaByAlunoForEachMateria(
  alunoObj?.nome || alunoNome
);
const mediasList = document.getElementById("medias-materias-list");
Object.entries(mediasMaterias).forEach(([materia, media]) => {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.textContent = `${materia}: ${media}`;
  mediasList.appendChild(li);
});

const mediaTurma = getMediaAvaliacaoForEachMateria();
let comparacaoTurmaChart = renderComparacaoTurmaChart(
  mediasMaterias,
  mediaTurma
);

const evolucaoNotasData = getMediaByAlunoForEachMateriaAndBimestre(alunoNome);
let evolucaoNotasChart = renderEvolucaoNotasChart(evolucaoNotasData);

const notasAluno = getNotasByAluno(alunoObj?.nome || alunoNome);
const notasValues = notasAluno.notas.map((obj) => obj.nota);

let distribuicaoNotasChart = renderDistribuicaoNotasChart(notasValues);

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

  const chartCtx = document
    .getElementById("evolucao-notas-chart")
    .getContext("2d");

  let [notasFiltradas, notasTurma] = filterNotasForComparacaoTurma(
    materia,
    bimestre,
    tipo
  );

  comparacaoTurmaChart.destroy();
  comparacaoTurmaChart = renderComparacaoTurmaChart(notasFiltradas, notasTurma);

  let notasEvolucaoFiltradas = filterNotasForEvolucaoNotas(
    materia,
    bimestre,
    tipo
  );

  evolucaoNotasChart.destroy();
  evolucaoNotasChart = renderEvolucaoNotasChart(notasEvolucaoFiltradas);

  let notasDistribuicaoFiltradas = filterNotasForDistribuicaoNotas(
    materia,
    bimestre,
    tipo
  );
  distribuicaoNotasChart.destroy();
  distribuicaoNotasChart = renderDistribuicaoNotasChart(
    notasDistribuicaoFiltradas
  );
};

window.clearFilters = function () {
  document.getElementById("filtro-materia").value = "All";
  document.getElementById("filtro-bimestre").value = "All";
  document.getElementById("filtro-tipo").value = "All";
  applyFilters();
};

const filterNotasForComparacaoTurma = (materia, bimestre, tipo) => {
  let notasFiltradas = {};
  let notasTurma = {};

  const filters = [
    // Casos específicos para uma matéria selecionada
    {
      condicion: () =>
        materia !== "All" && bimestre !== "All" && tipo !== "All",
      mediaAluno: () => ({
        [materia]: getMediaByAlunoMateriaTipoAndBimestre(
          alunoNome,
          materia,
          tipo,
          Number(bimestre)
        ),
      }),
      mediaTurma: () => ({
        [materia]: getMediaByMateriaTipoAndBimestre(
          materia,
          tipo,
          Number(bimestre)
        ),
      }),
    },
    {
      condicion: () =>
        materia !== "All" && bimestre !== "All" && tipo === "All",
      mediaAluno: () => ({
        [materia]: getMediaByAlunoMateriaAndBimestre(
          alunoNome,
          materia,
          Number(bimestre)
        ),
      }),
      mediaTurma: () => ({
        [materia]: getMediaByMateriaAndBimestre(materia, Number(bimestre)),
      }),
    },
    {
      condicion: () =>
        materia !== "All" && bimestre === "All" && tipo !== "All",
      mediaAluno: () => ({
        [materia]: getMediaByAlunoMateriaAndTipo(alunoNome, materia, tipo),
      }),
      mediaTurma: () => ({
        [materia]: getMediaByMateriaAndTipo(materia, tipo),
      }),
    },
    {
      condicion: () =>
        materia !== "All" && bimestre === "All" && tipo === "All",
      mediaAluno: () => ({
        [materia]: getMediaByAlunoAndMateria(alunoNome, materia),
      }),
      mediaTurma: () => ({ [materia]: getMediaByMateria(materia) }),
    },
    // Casos para todas as matérias
    {
      condicion: () =>
        materia === "All" && bimestre !== "All" && tipo !== "All",
      mediaAluno: () =>
        getMediaByAlunoBimestreAndTipoForEachMateria(
          alunoNome,
          Number(bimestre),
          tipo
        ),
      mediaTurma: () =>
        getMediaAvaliacaoByTipoAndBimestreForEachMateria(
          tipo,
          Number(bimestre)
        ),
    },
    {
      condicion: () =>
        materia === "All" && bimestre !== "All" && tipo === "All",
      mediaAluno: () =>
        getMediaByAlunoBimestreForEachMateria(alunoNome, Number(bimestre)),
      mediaTurma: () =>
        getMediaAvaliacaoByBimestreForEachMateria(Number(bimestre)),
    },
    {
      condicion: () =>
        materia === "All" && bimestre === "All" && tipo !== "All",
      mediaAluno: () => getMediaByAlunoAndTipoForEachMateria(alunoNome, tipo),
      mediaTurma: () => getMediaAvaliacaoByTipoForEachMateria(tipo),
    },
  ];

  for (const { condicion, mediaAluno, mediaTurma } of filters) {
    if (condicion()) {
      notasFiltradas = mediaAluno();
      notasTurma = mediaTurma();
      break;
    }
  }

  // Caso padrão (All, All, All)
  if (Object.keys(notasFiltradas).length === 0) {
    notasFiltradas = getMediaByAlunoForEachMateria(alunoNome);
    notasTurma = getMediaAvaliacaoForEachMateria();
  }

  return [notasFiltradas, notasTurma];
};

const filterNotasForEvolucaoNotas = (materia, bimestre, tipo) => {
  let notasFiltradas = [];

  const filters = [
    // Casos específicos para uma matéria selecionada
    {
      condicion: () =>
        materia !== "All" && bimestre !== "All" && tipo !== "All",
      fn: () => {
        // Para uma matéria específica com bimestre e tipo, retornar apenas essa matéria
        const resultado = getMediaByAlunoMateriaAndTipoForEachBimestre(
          alunoNome,
          materia,
          tipo
        );
        return Object.keys(resultado).length > 0
          ? [
              {
                materia: materia,
                notas: { [bimestre]: resultado[bimestre] || 0 },
              },
            ]
          : [];
      },
    },
    {
      condicion: () =>
        materia !== "All" && bimestre !== "All" && tipo === "All",
      fn: () => {
        // Para uma matéria específica com bimestre, mas todos os tipos
        const resultado = getNotasByAlunoMateriaAndBimestre(
          alunoNome,
          materia,
          Number(bimestre)
        );
        const media =
          resultado.length > 0
            ? (resultado.reduce((a, b) => a + b, 0) / resultado.length).toFixed(
                2
              )
            : 0;
        return [
          {
            materia: materia,
            notas: { [bimestre]: media },
          },
        ];
      },
    },
    {
      condicion: () =>
        materia !== "All" && bimestre === "All" && tipo !== "All",
      fn: () =>
        getMediaByAlunoTipoAndMateriaForEachBimestre(alunoNome, materia, tipo),
    },
    {
      condicion: () =>
        materia !== "All" && bimestre === "All" && tipo === "All",
      fn: () => getMediaByAlunoAndMateriaForEachBimestre(alunoNome, materia),
    },
    // Casos para todas as matérias
    {
      condicion: () =>
        materia === "All" && bimestre !== "All" && tipo !== "All",
      fn: () => {
        // Todas as matérias, mas apenas um bimestre específico com tipo específico
        const allMaterias = [
          "Matematica",
          "Portugues",
          "Historia",
          "Geografia",
          "Ciencias",
          "Artes",
        ];
        return allMaterias
          .map((mat) => {
            const resultado = getMediaByAlunoMateriaAndTipoForEachBimestre(
              alunoNome,
              mat,
              tipo
            );
            return {
              materia: mat,
              notas:
                Object.keys(resultado).length > 0
                  ? { [bimestre]: resultado[bimestre] || 0 }
                  : { [bimestre]: 0 },
            };
          })
          .filter((item) => Object.values(item.notas)[0] > 0);
      },
    },
    {
      condicion: () =>
        materia === "All" && bimestre !== "All" && tipo === "All",
      fn: () => {
        // Todas as matérias, mas apenas um bimestre específico
        const allMaterias = [
          "Matematica",
          "Portugues",
          "Historia",
          "Geografia",
          "Ciencias",
          "Artes",
        ];
        return allMaterias
          .map((mat) => {
            const notas = getNotasByAlunoMateriaAndBimestre(
              alunoNome,
              mat,
              Number(bimestre)
            );
            const media =
              notas.length > 0
                ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2)
                : 0;
            return {
              materia: mat,
              notas: { [bimestre]: media },
            };
          })
          .filter((item) => Object.values(item.notas)[0] > 0);
      },
    },
    {
      condicion: () =>
        materia === "All" && bimestre === "All" && tipo !== "All",
      fn: () =>
        getMediaByAlunoAndTipoForEachMateriaAndBimestre(alunoNome, tipo),
    },
  ];

  for (const { condicion, fn } of filters) {
    if (condicion()) {
      notasFiltradas = fn();
      break;
    }
  }

  // Caso padrão (All, All, All)
  if (notasFiltradas.length === 0) {
    notasFiltradas = getMediaByAlunoForEachMateriaAndBimestre(alunoNome);
  }

  return notasFiltradas;
};

const filterNotasForDistribuicaoNotas = (materia, bimestre, tipo) => {
  let notasFiltradas = notasAluno?.notas || [];

  const filters = [
    {
      condicion: () =>
        materia !== "All" && bimestre !== "All" && tipo !== "All",
      fn: () =>
        getNotasByAlunoMateriaTipoAndBimestre(
          alunoNome,
          materia,
          tipo,
          Number(bimestre)
        ),
    },
    {
      condicion: () =>
        materia !== "All" && bimestre !== "All" && tipo === "All",
      fn: () =>
        getNotasByAlunoMateriaAndBimestre(alunoNome, materia, Number(bimestre)),
    },
    {
      condicion: () =>
        materia !== "All" && bimestre === "All" && tipo !== "All",
      fn: () => getNotasByAlunoMateriaAndTipo(alunoNome, materia, tipo),
    },
    {
      condicion: () =>
        materia !== "All" && bimestre === "All" && tipo === "All",
      fn: () => getNotasByAlunoAndMateria(alunoNome, materia),
    },
    {
      condicion: () =>
        materia === "All" && bimestre !== "All" && tipo !== "All",
      fn: () =>
        getNotasByAlunoBimestreAndTipo(alunoNome, Number(bimestre), tipo),
    },
    {
      condicion: () =>
        materia === "All" && bimestre !== "All" && tipo === "All",
      fn: () => getNotasByAlunoAndBimestre(alunoNome, Number(bimestre)),
    },
    {
      condicion: () =>
        materia === "All" && bimestre === "All" && tipo !== "All",
      fn: () => getNotasByAlunoAndTipo(alunoNome, tipo),
    },
  ];

  for (const { condicion, fn } of filters) {
    if (condicion()) {
      notasFiltradas = fn();
      break;
    }
  }

  // Caso padrão (All, All, All)
  if (notasFiltradas === notasAluno?.notas) {
    return notasValues;
  }

  return notasFiltradas;
};

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
            <td style="color:${
              aprovado ? "#1976d2" : "#d32f2f"
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
