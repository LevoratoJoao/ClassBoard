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
  getMediaAvaliacaoByMateriaForEachTipo,
  getMediaAvaliacaoByMateriaForEachBimestre,
  getMediaAvaliacaoByMateriaForEachTipoAndBimestre,
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
  BY_TYPE: [getMediaAvaliacaoByMateriaForEachTipo, ["tipo"]],
  BY_BIMESTER: [getMediaAvaliacaoByMateriaForEachBimestre, ["bimestre"]],
  BY_TYPE_AND_BIMESTER: [
    getMediaAvaliacaoByMateriaForEachTipoAndBimestre,
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
  const tipos = ["Prova", "Trabalho"];
  const mediasPorTipo = tipos.map((tipo) => {
    const [fn, argNames] = barChartTypes["BY_TYPE"] || barChartTypes.ALL_NOTES;
    return {
      tipo,
      medias: fn(materia, ...getArgs(argNames, { tipo, bimestre })),
    };
  });

  const allLabels = Array.from(
    new Set(mediasPorTipo.flatMap((tp) => Object.keys(tp.medias)))
  );

  const datasets = mediasPorTipo.map((tp, idx) => ({
    label: tp.tipo,
    data: allLabels.map((label) => tp.medias[label] ?? null),
    borderColor: idx === 0 ? "#3A6EA5" : "#F7931E",
    borderWidth: 2,
    tension: 0.4,
    pointBackgroundColor: idx === 0 ? "#3A6EA5" : "#F7931E",
    pointBorderColor: "#ffffff",
    pointBorderWidth: 2,
    pointRadius: 6,
    pointHoverRadius: 8,
  }));

  const data = {
    labels: allLabels,
    datasets,
  };

  const options = {
    type: "line",
    data,
    options: {
      responsive: true,
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
            text: "Bimestres",
          },
        },
      },
      width: 800,
      height: 400,
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
