import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { notasAPI } from "../../services/apiService";
import { calcMedia } from "../../services/notasService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const NotasAvaliacoesChart = ({
  materia,
  tipo = "",
  bimestre = "",
  label = "Média da notas por Avaliação",
}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const tiposToShow =
        tipo && tipo !== "All" ? [tipo] : ["Prova", "Trabalho"];
      const bimestresToShow =
        bimestre && bimestre !== "All" ? [Number(bimestre)] : [1, 2, 3, 4];

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

              const media = calcMedia(notaValues);
              return media;
            })
          );

          return {
            label: tipoItem,
            data,
            borderColor: idx === 0 ? "#3A6EA5" : "#F7931E",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: idx === 0 ? "#3A6EA5" : "#F7931E",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          };
        })
      );

      setChartData({
        labels: bimestresToShow.map((b) => `Bimestre ${b}`),
        datasets,
      });
      setLoading(false);
    };

    fetchData();
  }, [materia, tipo, bimestre]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: label + ` - ${materia}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: "Média das Notas",
        },
      },
      x: {
        title: {
          display: true,
          text: "Bimestres",
        },
      },
    },
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Média das Notas por Avaliação</h6>
      <div style={{ width: "700px", height: "400px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default NotasAvaliacoesChart;
