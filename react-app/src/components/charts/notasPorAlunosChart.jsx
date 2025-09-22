import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getNotasByMateria,
  getNotasByMateriaAndBimestre,
  getNotasByMateriaAndTipo,
  getNotasByMateriaTipoAndBimestre,
} from "../../services/notasService";
import { getArgs } from "../../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const doughnutChartTypes = {
  ALL_NOTES: [getNotasByMateria, []],
  BY_BIMESTER: [getNotasByMateriaAndBimestre, ["bimestre"]],
  BY_TYPE: [getNotasByMateriaAndTipo, ["tipo"]],
  BY_TYPE_AND_BIMESTER: [
    getNotasByMateriaTipoAndBimestre,
    ["tipo", "bimestre"],
  ],
};

const NotasPorAlunosChart = ({
  materia,
  chartType = "ALL_NOTES",
  tipo = "",
  bimestre = 0,
  label = "Distribuição de Frequência das Notas",
}) => {
  const bimestres = [1, 2, 3];
  const tipos = ["Prova", "Trabalho"];

  const datasets = tipos.map((tipo, idx) => {
    const data = bimestres.map((bimestre) => {
      const [fn, argNames] = doughnutChartTypes["BY_TYPE_AND_BIMESTER"];
      const notas = fn(materia, ...getArgs(argNames, { tipo, bimestre }));
      if (!notas.length) return null;
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      return Number(media.toFixed(2));
    });
    return {
      label: tipo,
      data,
      backgroundColor:
        idx === 0 ? "rgba(54, 162, 235, 0.7)" : "rgba(255, 99, 132, 0.7)",
    };
  });

  const data = {
    labels: bimestres.map((b) => `Bimestre ${b}`),
    datasets,
  };

  const options = {
    type: "bar",
    data,
    options: {
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
    },
  };

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Distribuição de Frequência das Notas</h6>
      <div style={{ width: "700px", height: "400px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default NotasPorAlunosChart;
