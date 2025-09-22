import { renderChartNotasOverview, renderChartForEachAvaliacao, renderChartNotasPorAvaliacao } from "./charts.js";
import { buildMateriaAiAnalysis } from "./aiAnalysis.js";
import { getMediaForEachMateria, getMediaByMateria } from "./services/notasService.js";
import { getAvaliacoesByMateria } from "./services/avaliacoesService.js";

const params = new URLSearchParams(window.location.search);
const materia = params.get('materia');

document.getElementById('materia-title').textContent = materia || 'Matéria não encontrada';

const mediaNotas = document.getElementById('media_notas').getContext('2d');
const notasAvaliacoes = document.getElementById('notas_avaliacoes').getContext('2d');
const notasPorAluno = document.getElementById('notas_alunos').getContext('2d');

let mediaChart = new Chart(mediaNotas, renderChartNotasOverview(materia, 'ALL_NOTES', "", 0, 'Notas das avaliações'));
let notasAvaliacoesChart = new Chart(notasAvaliacoes, renderChartForEachAvaliacao(materia, 'ALL_AVALIACAO', "", 0, 'Média da notas por Avaliação'));
let notasPorAlunoChart = new Chart(notasPorAluno, renderChartNotasPorAvaliacao(materia, 'ALL_NOTES', "", 0, 'Notas por Aluno'));

const aiAnalysis = buildMateriaAiAnalysis(materia);
document.getElementById('ai-summary').textContent = aiAnalysis.summary;
document.getElementById('ai-comment').innerHTML = aiAnalysis.comment;

window.applyFilters = function () {
    const bimestre = document.querySelector('input[name="bimestre"]:checked').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;


    const chartCtx = document.getElementById('media_notas').getContext('2d');
    let chartType, chartTipo = "", chartBimestre = 0, chartLabel;

    if (bimestre === "All" && tipo === "All") {
        chartType = 'ALL_NOTES';
        chartLabel = 'Notas das avaliações';
    } else if (bimestre === "All") {
        chartType = 'BY_TYPE';
        chartTipo = tipo;
        chartLabel = `Notas de ${tipo}`;
    } else if (tipo === "All") {
        chartType = 'BY_BIMESTER';
        chartBimestre = bimestre;
        chartLabel = `Notas do bimestre ${bimestre}`;
    } else {
        chartType = 'BY_TYPE_AND_BIMESTER';
        chartTipo = tipo;
        chartBimestre = Number(bimestre);
        chartLabel = `Notas de ${tipo} do bimestre ${bimestre}`;
    }

    mediaChart.destroy();
    mediaChart = new Chart(
        chartCtx,
        renderChartNotasOverview(materia, chartType, chartTipo, chartBimestre, chartLabel)
    );

    notasAvaliacoesChart.destroy();
    notasAvaliacoesChart = new Chart(
        notasAvaliacoes,
        renderChartForEachAvaliacao(materia, chartType, chartTipo, chartBimestre, chartLabel)
    );

    notasPorAlunoChart.destroy();
    notasPorAlunoChart = new Chart(
        notasPorAluno,
        renderChartNotasPorAvaliacao(materia, chartType, chartTipo, chartBimestre, chartLabel)
    );

    mediaChart.update();
}

window.clearFilters = function () {
    document.querySelector('input[name="bimestre"][value="All"]').checked = true;
    document.querySelector('input[name="tipo"][value="All"]').checked = true;
    applyFilters();
}

const calcularRankingMateria = () => {
    const mediasMaterias = getMediaForEachMateria();
    mediasMaterias.sort((a, b) => b.media - a.media);
    const ranking = mediasMaterias.map((item, index) => ({
        ...item,
        rank: index + 1
    }));
    return ranking;
};
const ranking = calcularRankingMateria();
document.getElementById('ranking-materia').textContent = `${ranking.find(r => r.materia === materia)?.rank || 'N/A'}º de ${ranking.length}`;

const mediaTotalMateria = getMediaByMateria(materia);
document.getElementById('media-total').textContent = `${mediaTotalMateria} de 10`;

const avaliacoesMateria = getAvaliacoesByMateria(materia);
const ul = document.getElementById('avaliacoes-list');
avaliacoesMateria.forEach(notaObj => {
    ul.innerHTML += `<li class="list-group-item">
        <strong>${notaObj.tipo}</strong> - ${notaObj.bimestre}º Bimestre
    </li>`;
});