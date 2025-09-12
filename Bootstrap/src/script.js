import { buildChartMediaNotas, buildChartForEachAvaliacao, buildAiAnalysis } from "./charts.js";

const params = new URLSearchParams(window.location.search);
const materia = params.get('materia');

const detalhes = {
    'Portugues': 'Detalhes sobre a matéria de Português.',
    'Matematica': 'Detalhes sobre a matéria de Matemática.',
    'Historia': 'Detalhes sobre a matéria de História.',
    'Geografia': 'Detalhes sobre a matéria de Geografia.',
    'Ciencias': 'Detalhes sobre a matéria de Ciências.',
    'Artes': 'Detalhes sobre a matéria de Artes.',
};

document.getElementById('materia-title').textContent = materia || 'Matéria não encontrada';
document.getElementById('materia-details').textContent = detalhes[materia] || 'Nenhum detalhe disponível.';

const allNotes = document.getElementById('media_notas').getContext('2d');
const notesByAvaliacao = document.getElementById('notas_avaliacoes').getContext('2d');

let mediaChart = new Chart(allNotes, buildChartMediaNotas(materia, 'ALL_NOTES', "", 0, 'Notas das avaliações'));
let notasAvaliacoesChart = new Chart(notesByAvaliacao, buildChartForEachAvaliacao(materia, 'ALL_AVALIACAO', "", 0, 'Média da notas por Avaliação'));

const aiAnalysis = buildAiAnalysis(materia);
document.getElementById('ai-summary').textContent = aiAnalysis.summary;
document.getElementById('ai-comment').textContent = aiAnalysis.comment;

window.applyFilters = function () {
    const bimestre = document.getElementById('bimestreFilter').value;
    const tipo = document.getElementById('tipoFilter').value;

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
        buildChartMediaNotas(materia, chartType, chartTipo, chartBimestre, chartLabel)
    );

    notasAvaliacoesChart.destroy();
    notasAvaliacoesChart = new Chart(
        notesByAvaliacao,
        buildChartForEachAvaliacao(materia, chartType, chartTipo, chartBimestre, chartLabel)
    );

    mediaChart.update();
}
