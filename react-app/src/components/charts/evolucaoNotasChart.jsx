import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const EvolucaoNotasChart = ({ evolucaoData = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    console.log("Dados de evolução recebidos:", evolucaoData);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current?.getContext("2d");
    if (!ctx || !evolucaoData || evolucaoData.length === 0) return;

    const colors = [
      "rgba(54, 162, 235, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    const allLabels = new Set();
    evolucaoData.forEach((item) => {
      if (item.notas) {
        Object.keys(item.notas).forEach((bimestre) => {
          allLabels.add(`Bimestre ${bimestre}`);
        });
      }
    });
    const labels = Array.from(allLabels).sort();

    const datasets = evolucaoData.map((item, idx) => {
      const dataPoints = labels.map((label) => {
        const bimestre = label.replace("Bimestre ", "");
        return parseFloat(item.notas?.[bimestre]) || 0;
      });

      return {
        label: item.materia,
        data: dataPoints,
        borderColor: colors[idx % colors.length],
        backgroundColor: colors[idx % colors.length],
        fill: false,
        tension: 0.2,
      };
    });

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [evolucaoData]);

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Evolução das notas ao longo do tempo</h6>
      {evolucaoData.length === 0 ? (
        <div
          className="alert alert-info text-center"
          style={{ width: "700px" }}
        >
          <i className="bi bi-info-circle me-2"></i>
          Não há dados suficientes para mostrar a evolução das notas ao longo do
          tempo.
        </div>
      ) : (
        <canvas ref={chartRef} width="700" height="400"></canvas>
      )}
    </div>
  );
};

export default EvolucaoNotasChart;
