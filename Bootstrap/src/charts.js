import {
    getNotasByMateria, getNotasByMateriaAndBimestre,
    getNotasByMateriaAndTipo, getMediaAvaliacaoByMateriaForEachTipoAndBimestre, getNotasByMateriaTipoAndBimestre,
    getMediaAvaliacaoByMateriaForEachAvaliacao, getMediaAvaliacaoByMateriaForEachTipo, getMediaAvaliacaoByMateriaForEachBimestre,
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
        labels: ['0-2', '3-4', '5-6', '7-8', '9-10'],
        datasets: [{
            label,
            data: [
                notas.filter(n => n >= 0 && n <= 2).length,
                notas.filter(n => n >= 3 && n <= 4).length,
                notas.filter(n => n >= 5 && n <= 6).length,
                notas.filter(n => n >= 7 && n <= 8).length,
                notas.filter(n => n >= 9 && n <= 10).length
            ],
            backgroundColor: ['#D1495B', '#F7931E', '#F7E06C', '#4bc0c0ff', '#3A6EA5'],
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
    const tipos = ['Prova', 'Trabalho'];
    const mediasPorTipo = tipos.map(tipo => {
        const [fn, argNames] = barChartTypes['BY_TYPE'] || barChartTypes.ALL_NOTES;
        return {
            tipo,
            medias: fn(materia, ...getArgs(argNames, { tipo, bimestre }))
        };
    });

    const allLabels = Array.from(new Set(
        mediasPorTipo.flatMap(tp => Object.keys(tp.medias))
    ));

    const datasets = mediasPorTipo.map((tp, idx) => ({
        label: tp.tipo,
        data: allLabels.map(label => tp.medias[label] ?? null),
        borderColor: idx === 0 ? '#3A6EA5' : '#F7931E',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: idx === 0 ? '#3A6EA5' : '#F7931E',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
    }));

    const data = {
        labels: allLabels,
        datasets
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
                        text: 'Bimestres'
                    }
                }
            },
            width: 800,
            height: 400
        }
    };
};

export const renderChartNotasPorAluno = (
    materia,
    chartType = 'ALL_NOTES',
    tipo = "",
    bimestre = 0,
    label = 'Média das Notas por Bimestre e Tipo'
) => {
    const bimestres = [1, 2, 3];
    const tipos = ['Prova', 'Trabalho'];

    const datasets = tipos.map((tipo, idx) => {
        const data = bimestres.map(bimestre => {
            const [fn, argNames] = doughnutChartTypes['BY_TYPE_AND_BIMESTER'];
            const notas = fn(materia, ...getArgs(argNames, { tipo, bimestre }));
            if (!notas.length) return null;
            const media = notas.reduce((a, b) => a + b, 0) / notas.length;
            return Number(media.toFixed(2));
        });
        return {
            label: tipo,
            data,
            backgroundColor: idx === 0 ? "rgba(54, 162, 235, 0.7)" : "rgba(255, 99, 132, 0.7)",
        };
    });

    const data = {
        labels: bimestres.map(b => `Bimestre ${b}`),
        datasets
    };

    return {
        type: 'bar',
        data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: label + ` - ${materia}`
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Bimestres' },
                    stacked: false
                },
                y: {
                    title: { display: true, text: 'Média das Notas' },
                    beginAtZero: true,
                    max: 10,
                    ticks: { stepSize: 1 }
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