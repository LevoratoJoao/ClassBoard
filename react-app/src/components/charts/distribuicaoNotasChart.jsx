import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DistribuicaoNotasChart = ({ notasAluno = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    const bins = Array(11).fill(0);
    notasAluno.forEach((nota) => {
      if (typeof nota === "number" && nota >= 0 && nota <= 10) {
        bins[Math.round(nota)]++;
      }
    });

    const baseColor = "31, 118, 210"; // RGB do #1976d2
    const gradientColors = Array.from(
      { length: 11 },
      (_, i) => `rgba(${baseColor}, ${1 - i * 0.08})`
    );

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: bins.map((_, i) => i.toString()),
        datasets: [
          {
            label: "Frequência das médias",
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

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [notasAluno]);

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Distribuição das médias por matéria</h6>
      <canvas ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
};

export default DistribuicaoNotasChart;
