import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  getNotasByMateria,
  getNotasByMateriaAndBimestre,
  getNotasByMateriaAndTipo,
  getNotasByMateriaTipoAndBimestre,
} from "../../services/notasService";
import { getArgs } from "../../utils/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const doughnutChartTypes = {
  ALL_NOTES: [getNotasByMateria, []],
  BY_BIMESTER: [getNotasByMateriaAndBimestre, ["bimestre"]],
  BY_TYPE: [getNotasByMateriaAndTipo, ["tipo"]],
  BY_TYPE_AND_BIMESTER: [
    getNotasByMateriaTipoAndBimestre,
    ["tipo", "bimestre"],
  ],
};

const NotasOverviewChart = ({
  materia,
  chartType = "ALL_NOTES",
  tipo = "",
  bimestre = 0,
  label = "Distribuição de Frequência das Notas",
}) => {
  const [fn, argNames] =
    doughnutChartTypes[chartType] || doughnutChartTypes.ALL_NOTES;
  const notas = fn(materia, ...getArgs(argNames, { tipo, bimestre }));

  const data = {
    labels: ["0-2", "3-4", "5-6", "7-8", "9-10"],
    datasets: [
      {
        label,
        data: [
          notas.filter((n) => n >= 0 && n <= 2).length,
          notas.filter((n) => n >= 3 && n <= 4).length,
          notas.filter((n) => n >= 5 && n <= 6).length,
          notas.filter((n) => n >= 7 && n <= 8).length,
          notas.filter((n) => n >= 9 && n <= 10).length,
        ],
        backgroundColor: [
          "#D1495B",
          "#F7931E",
          "#F7E06C",
          "#4bc0c0ff",
          "#3A6EA5",
        ],
        hoverOffset: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    width: 400,
    height: 400,
  };

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <h6>Notas Gerais</h6>
      <div style={{ width: "400px", height: "400px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default NotasOverviewChart;
