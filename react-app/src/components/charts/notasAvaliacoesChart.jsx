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
import {
  getMediaAvaliacaoByMateriaForEachTipoAndBimestre,
} from "../../services/notasService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EvolucaoNotasChart = ({
  materia,
  chartType = "ALL_NOTES",
  tipo = "",
  bimestre = "",
  label = "Média da notas por Avaliação",
}) => {
  let tiposToShow = ["Prova", "Trabalho"];
  let bimestresToShow = [1, 2, 3];

  if (tipo && tipo !== "All") {
    tiposToShow = [tipo];
  }
  if (bimestre && bimestre !== "All") {
    bimestresToShow = [Number(bimestre)];
  }

  const datasets = tiposToShow.map((tipoItem, idx) => {
    const data = bimestresToShow.map((bimestreItem) => {
      const mediasObj = getMediaAvaliacaoByMateriaForEachTipoAndBimestre(
        materia,
        tipoItem,
        bimestreItem
      );
      const key = `Bimestre ${bimestreItem}`;
      return mediasObj[key] !== undefined ? Number(mediasObj[key]) : null;
    });
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
  });

  const data = {
    labels: bimestresToShow.map((b) => `Bimestre ${b}`),
    datasets,
  };

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
    width: 800,
    height: 400,
  };

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Média das Notas por Avaliação</h6>
      <div style={{ width: "700px", height: "400px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default EvolucaoNotasChart;
