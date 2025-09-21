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
  const [fn, argNames] =
    doughnutChartTypes[chartType] || doughnutChartTypes.ALL_NOTES;
  const notas = fn(materia, ...getArgs(argNames, { tipo, bimestre }));

  const faixas = [
    { range: "0-2", min: 0, max: 2, color: "#D1495B" },
    { range: "3-4", min: 3, max: 4, color: "#F7931E" },
    { range: "5-6", min: 5, max: 6, color: "#F7E06C" },
    { range: "7-8", min: 7, max: 8, color: "#4bc0c0ff" },
    { range: "9-10", min: 9, max: 10, color: "#3A6EA5" },
  ];

  const frequencias = faixas.map((faixa) => {
    return notas.filter((nota) => nota >= faixa.min && nota <= faixa.max)
      .length;
  });

  const data = {
    labels: faixas.map((f) => f.range),
    datasets: [
      {
        label: `Quantidade de notas - ${materia}`,
        data: frequencias,
        backgroundColor: faixas.map((f) => f.color),
        borderColor: faixas.map((f) => f.color),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    type: "bar",
    data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `${label} - ${materia}`,
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Faixas de Notas" },
        },
        y: {
          title: { display: true, text: "Quantidade de Alunos" },
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
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
