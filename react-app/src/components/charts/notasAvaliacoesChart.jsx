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
  getMediaAvaliacaoByMateriaForEachAvaliacao,
  getMediaAvaliacaoByMateriaForEachType,
  getMediaAvaliacaoByMateriaForEachBimestre,
  getMediaAvaliacaoByMateriaForEachTypeAndBimestre,
} from "../../services/notasService";
import { getArgs } from "../../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const barChartTypes = {
  ALL_NOTES: [getMediaAvaliacaoByMateriaForEachAvaliacao, []],
  BY_TYPE: [getMediaAvaliacaoByMateriaForEachType, ["tipo"]],
  BY_BIMESTER: [getMediaAvaliacaoByMateriaForEachBimestre, ["bimestre"]],
  BY_TYPE_AND_BIMESTER: [
    getMediaAvaliacaoByMateriaForEachTypeAndBimestre,
    ["tipo", "bimestre"],
  ],
};

const EvolucaoNotasChart = ({
  materia,
  chartType = "ALL_NOTES",
  tipo = "",
  bimestre = 0,
  label = "Média da notas por Avaliação",
}) => {
  const [fn, argNames] = barChartTypes[chartType] || barChartTypes.ALL_NOTES;
  const medias = fn(materia, ...getArgs(argNames, { tipo, bimestre }));

  const data = {
    labels: Object.keys(medias),
    datasets: [
      {
        label,
        data: Object.values(medias),
        borderColor: "#3A6EA5",
        backgroundColor: "rgba(58, 110, 165, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3A6EA5",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
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
          text: "Avaliações",
        },
      },
    },
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
