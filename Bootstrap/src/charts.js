import {
    getNotasByMateria, getNotasByMateriaAndBimestre,
    getNotasByMateriaAndTipo, getMediaAvaliacaoByMateriaForEachTipoAndBimestre, getNotasByMateriaTipoAndBimestre,
    getMediaAvaliacaoByMateriaForEachAvaliacao, getMediaAvaliacaoByMateriaForEachTipo, getMediaAvaliacaoByMateriaForEachBimestre,
    getMediaAvaliacaoForEachMateria,
    getNotasByAlunoAndMateriaForEachBimestre,
    getNotasByAluno
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

export const renderChartMediaNotas = (materia, chartType = 'ALL_NOTES', tipo = "", bimestre = 0, label = 'Notas das avaliações') => {
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

export const renderChartForEachAvaliacao = (materia, chartType = 'ALL_NOTES', tipo = "", bimestre = 0, label = 'Média da notas por Avaliação') => {
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

export const renderChartNotasPorAluno = (materia, chartType = 'ALL_NOTES', tipo = "", bimestre = 0, label = 'Distribuição de Frequência das Notas') => {
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

const mediaAprovacao = 6;

export const renderComparacaoTurmaChart = (mediasMaterias, mediasTurma) => {
    return new Chart(
        document.getElementById("comparacao-turma-chart").getContext("2d"),
        {
            type: "bar",
            data: {
                labels: Object.keys(mediasMaterias),
                datasets: [
                    {
                        label: "Aluno",
                        data: mediasMaterias,
                        backgroundColor: "rgba(54, 162, 235, 0.7)",
                    },
                    {
                        label: "Turma",
                        data: mediasTurma,
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
}

export const renderEvolucaoNotasChart = (notas) => {
    const colors = [
        "rgba(54, 162, 235, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
    ];

    const datasets = notas.map((n, idx) => ({
        label: n.materia,
        data: Object.fromEntries(
            Object.entries(n.notas).map(([bimestre, media]) => [
                `Bimestre ${bimestre}`,
                media
            ])
        ),
        borderColor: colors[idx % colors.length],
        backgroundColor: colors[idx % colors.length],
        fill: false,
        tension: 0.2,
    }));
    const ctx = document.getElementById("evolucao-notas-chart").getContext("2d");
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: datasets.length ? Object.keys(datasets[0].data) : [],
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

export const renderDistribuicaoNotasChart = (notasAluno) => {
    const bins = Array(11).fill(0);
    notasAluno.forEach((nota) => {
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
    return new Chart(ctx, {
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