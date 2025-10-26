import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { notasAPI } from "../../services/apiService";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { calcMedia } from "../../services/notasService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const NotasPorAvaliacaoChart = ({
  materia,
  tipo = "",
  bimestre = 0,
  label = "Distribuição de Frequência das Notas",
}) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const tiposToShow =
    tipo && tipo !== "All" ? [tipo] : ["Prova", "Trabalho"];
  const bimestresToShow =
    bimestre && bimestre !== "All" ? [Number(bimestre)] : [1, 2, 3, 4];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datasets = await Promise.all(
          tiposToShow.map(async (tipoItem, idx) => {
            const data = await Promise.all(
              bimestresToShow.map(async (bimestreItem) => {
                const result = await notasAPI.filterNotas(
                  materia,
                  tipoItem,
                  bimestreItem
                );
                const notaValues = result.map((item) => item.nota);
                if (!notaValues.length) return null;
                const media = calcMedia(notaValues);
                return Number(media);
              })
            );
            return {
              label: tipoItem,
              data,
              backgroundColor:
                idx === 0
                  ? "rgba(54, 162, 235, 0.7)"
                  : "rgba(255, 99, 132, 0.7)",
            };
          })
        );

        setChartData({
          labels: bimestresToShow.map((b) => `Bimestre ${b}`),
          datasets,
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [materia, tipo, bimestre]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: label + ` - ${materia}`,
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Bimestres" },
        stacked: false,
      },
      y: {
        title: { display: true, text: "Média das Notas" },
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 1 },
      },
    },
    width: 800,
    height: 400,
  };

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Distribuição de Frequência das Notas</h6>
      <div style={{ width: "700px", height: "400px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default NotasPorAvaliacaoChart;
