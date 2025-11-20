import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const NotasIndividuaisChart = ({ notasDetalhadas = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current?.getContext("2d");
    if (!ctx || !notasDetalhadas || notasDetalhadas.length === 0) return;

    // Cores para cada matéria
    const materiaColors = {
      Matematica: "rgba(54, 162, 235, 0.8)",
      Portugues: "rgba(255, 99, 132, 0.8)",
      Ciencias: "rgba(75, 192, 192, 0.8)",
      Historia: "rgba(255, 206, 86, 0.8)",
      Geografia: "rgba(153, 102, 255, 0.8)",
      Artes: "rgba(255, 159, 64, 0.8)",
    };

    // Preparar dados para o gráfico
    const labels = [];
    const datasets = [];
    const backgroundColors = [];
    const borderColors = [];

    notasDetalhadas.forEach((item) => {
      labels.push(`${item.materia}\n(${item.avaliacao})`);
      datasets.push(item.nota);

      const cor = materiaColors[item.materia] || "rgba(128, 128, 128, 0.8)";
      backgroundColors.push(cor);
      borderColors.push(cor.replace("0.8", "1"));
    });

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Nota",
            data: datasets,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: function (context) {
                const item = notasDetalhadas[context[0].dataIndex];
                return `${item.materia} - ${item.avaliacao}`;
              },
              label: function (context) {
                const item = notasDetalhadas[context.dataIndex];
                return [
                  `Nota: ${item.nota}`,
                  `Tipo: ${item.tipo}`,
                  `Bimestre: ${item.bimestre}º`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            title: {
              display: true,
              text: "Nota",
            },
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            title: {
              display: true,
              text: "Matérias e Avaliações",
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [notasDetalhadas]);

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Notas Individuais por Matéria</h6>
      {notasDetalhadas.length === 0 ? (
        <div
          className="alert alert-info text-center"
          style={{ width: "700px" }}
        >
          <i className="bi bi-info-circle me-2"></i>
          Não há notas individuais para exibir com os filtros aplicados.
        </div>
      ) : (
        <div style={{ width: "800px", height: "450px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
      )}
    </div>
  );
};

export default NotasIndividuaisChart;
