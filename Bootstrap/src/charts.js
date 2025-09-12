import {
    getNotasByMateria, getMediaByMateria, getNotasByMateriaAndBimestre,
    getMediaByMateriaAndBimestre, getNotasByMateriaAndTipo, getMediaByMateriaAndTipo, getNotasByMateriaTipoAndBimestre,
    getMediaAvaliacaoByMateriaForEachAvaliacao, getMediaAvaliacaoByMateriaForEachType, getMediaAvaliacaoByMateriaForEachBimestre
} from "./services/notasService.js";

const doughnutChartTypes = {
    ALL_NOTES: getNotasByMateria,
    BY_BIMESTER: getNotasByMateriaAndBimestre,
    BY_TYPE: getNotasByMateriaAndTipo,
    BY_TYPE_AND_BIMESTER: getNotasByMateriaTipoAndBimestre
};

const barChartTypes = {
    ALL_NOTES: getMediaAvaliacaoByMateriaForEachAvaliacao,
    BY_TYPE: getMediaAvaliacaoByMateriaForEachType,
    BY_BIMESTER: getMediaAvaliacaoByMateriaForEachBimestre
};

export const buildChartMediaNotas = (materia, chartType, tipo, bimestre, label) => {

    let notas = [];
    if (chartType === 'BY_BIMESTER') {
        notas = doughnutChartTypes[chartType](materia, bimestre);
    } else if (chartType === 'BY_TYPE') {
        notas = doughnutChartTypes[chartType](materia, tipo);
    } else if (chartType === 'BY_TYPE_AND_BIMESTER') {
        notas = doughnutChartTypes[chartType](materia, tipo, bimestre);
    } else {
        notas = doughnutChartTypes[chartType](materia);
    }

    const data = {
        labels: [
            '< 3',
            '3-5',
            '5-8',
            '> 8',
        ],
        datasets: [{
            label: label,
            data: [
                notas.filter(nota => nota < 3).length,
                notas.filter(nota => nota >= 3 && nota < 5).length,
                notas.filter(nota => nota >= 5 && nota < 8).length,
                notas.filter(nota => nota >= 8).length
            ],
            backgroundColor: [
                '#D1495B',
                '#F7E06C',
                '#4bc0c0ff',
                '#3A6EA5',
            ],
            hoverOffset: 3
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: false,
            width: 200,
            height: 200
        }
    };
    return config;
};

export const buildChartForEachAvaliacao = (materia, chartType, tipo, bimestre, label) => {
    let medias = {};

    if (chartType === 'BY_BIMESTER') {
        medias = barChartTypes[chartType](materia, bimestre);
    } else if (chartType === 'BY_TYPE') {
        medias = barChartTypes[chartType](materia, tipo);
    } else {
        medias = barChartTypes['ALL_NOTES'](materia);
    }

    const data = {
        labels: Object.keys(medias),
        datasets: [{
            label: label,
            data: Object.values(medias),
            backgroundColor: [
                '#D1495B',
                '#F7E06C',
                '#4bc0c0ff',
                '#3A6EA5',
            ],
            hoverOffset: 3
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            width: 800,
            height: 400
        }
    };
    return config;
};

export const buildAiAnalysis = (materia) => {
    return {
        summary: `Análise de desempenho para a matéria de ${materia}.`,
        comment: `Média das notas: ${getMediaByMateria(materia)}`,
    };
}