import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ComparacaoTurmaChart = ({ mediasMaterias = {}, mediasTurma = {} }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Verificar se temos dados válidos
    if (!mediasMaterias || Object.keys(mediasMaterias).length === 0) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    // Obter todas as matérias únicas de ambos os objetos
    const todasMaterias = new Set([
      ...Object.keys(mediasMaterias),
      ...Object.keys(mediasTurma || {}),
    ]);

    const labels = Array.from(todasMaterias);

    const dadosAluno = labels.map((materia) => {
      const media = mediasMaterias[materia];
      const valor = media === "N/A" ? 0 : parseFloat(media) || 0;
      return valor;
    });

    const dadosTurma = labels.map((materia) => {
      const mediaTurmaMateria = mediasTurma[materia];
      let valor = 0;

      if (mediaTurmaMateria && mediaTurmaMateria !== "N/A") {
        valor = parseFloat(mediaTurmaMateria) || 0;
      }

      return valor;
    });

    // Verificar se temos dados válidos antes de criar o gráfico
    if (labels.length === 0) {
      return;
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Aluno",
            data: dadosAluno,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
          },
          {
            label: "Turma",
            data: dadosTurma,
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
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
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
            const y = yScale.getPixelForValue(6); // Média de aprovação
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
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [mediasMaterias, mediasTurma]);

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Comparação com média da turma</h6>
      <canvas ref={chartRef} width="700" height="400"></canvas>
    </div>
  );
};

export default ComparacaoTurmaChart;
