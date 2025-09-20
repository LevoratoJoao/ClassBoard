import {
    getNotasByMateria, getMediaByMateria, getNotasByMateriaAndBimestre,
    getMediaByMateriaAndBimestre, getNotasByMateriaAndTipo, getMediaAvaliacaoByMateriaForEachTipoAndBimestre, getNotasByMateriaTipoAndBimestre,
    getMediaAvaliacaoByMateriaForEachAvaliacao, getMediaAvaliacaoByMateriaForEachTipo, getMediaAvaliacaoByMateriaForEachBimestre
} from "./services/notasService.js";

const doughnutChartTypes = {
    ALL_NOTES: [getNotasByMateria, []],
    BY_BIMESTER: [getNotasByMateriaAndBimestre, ['bimestre']],
    BY_TYPE: [getNotasByMateriaAndTipo, ['tipo']],
    BY_TYPE_AND_BIMESTER: [getNotasByMateriaTipoAndBimestre, ['tipo', 'bimestre']]
};

const barChartTypes = {
    ALL_NOTES: [getMediaAvaliacaoByMateriaForEachAvaliacao, []],
    BY_TYPE: [getMediaAvaliacaoByMateriaForEachTipo, ['tipo']],
    BY_BIMESTER: [getMediaAvaliacaoByMateriaForEachBimestre, ['bimestre']],
    BY_TYPE_AND_BIMESTER: [getMediaAvaliacaoByMateriaForEachTipoAndBimestre, ['tipo', 'bimestre']]
};

function getArgs(argNames, params) {
    return argNames.map(name => params[name]);
}

export const buildChartMediaNotas = (materia, chartType = 'ALL_NOTES', tipo = "", bimestre = 0, label = 'Notas das avaliações') => {
    const [fn, argNames] = doughnutChartTypes[chartType] || doughnutChartTypes.ALL_NOTES;
    const notas = fn(materia, ...getArgs(argNames, { tipo, bimestre }));

    const data = {
        labels: ['< 3', '3-5', '5-8', '> 8'],
        datasets: [{
            label,
            data: [
                notas.filter(nota => nota < 3).length,
                notas.filter(nota => nota >= 3 && nota < 5).length,
                notas.filter(nota => nota >= 5 && nota < 8).length,
                notas.filter(nota => nota >= 8).length
            ],
            backgroundColor: ['#D1495B', '#F7E06C', '#4bc0c0ff', '#3A6EA5'],
            hoverOffset: 3
        }]
    };

    return {
        type: 'doughnut',
        data,
        options: {
            responsive: false,
            width: 200,
            height: 200
        }
    };
};

export const buildChartForEachAvaliacao = (materia, chartType = 'ALL_NOTES', tipo = "", bimestre = 0, label = 'Média da notas por Avaliação') => {
    const [fn, argNames] = barChartTypes[chartType] || barChartTypes.ALL_NOTES;
    const medias = fn(materia, ...getArgs(argNames, { tipo, bimestre }));

    const data = {
        labels: Object.keys(medias),
        datasets: [{
            label,
            data: Object.values(medias),
            borderColor: '#3A6EA5',
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: '#3A6EA5',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    return {
        type: 'line',
        data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Média das Notas'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Avaliações'
                    }
                }
            },
            width: 800,
            height: 400
        }
    };
};

export const buildChartNotasPorAluno = (materia, chartType = 'ALL_NOTES', tipo = "", bimestre = 0, label = 'Distribuição de Frequência das Notas') => {
    const [fn, argNames] = doughnutChartTypes[chartType] || doughnutChartTypes.ALL_NOTES;
    const notas = fn(materia, ...getArgs(argNames, { tipo, bimestre }));

    const faixas = [
        { range: '0-2', min: 0, max: 2, color: '#D1495B' },
        { range: '3-4', min: 3, max: 4, color: '#F7931E' },
        { range: '5-6', min: 5, max: 6, color: '#F7E06C' },
        { range: '7-8', min: 7, max: 8, color: '#4bc0c0ff' },
        { range: '9-10', min: 9, max: 10, color: '#3A6EA5' }
    ];

    const frequencias = faixas.map(faixa => {
        return notas.filter(nota => nota >= faixa.min && nota <= faixa.max).length;
    });

    const data = {
        labels: faixas.map(f => f.range),
        datasets: [{
            label: `Quantidade de notas - ${materia}`,
            data: frequencias,
            backgroundColor: faixas.map(f => f.color),
            borderColor: faixas.map(f => f.color),
            borderWidth: 1
        }]
    };

    return {
        type: 'bar',
        data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${label} - ${materia}`
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Faixas de Notas' }
                },
                y: {
                    title: { display: true, text: 'Quantidade de Alunos' },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            width: 800,
            height: 400
        }
    };
};