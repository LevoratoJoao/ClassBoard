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
}) => {
  const [fn, argNames] =
    doughnutChartTypes[chartType] || doughnutChartTypes.ALL_NOTES;
  const notas = fn(materia, ...getArgs(argNames, { tipo, bimestre }));

  const data = {
    labels: ["< 3", "3-5", "5-8", "> 8"],
    datasets: [
      {
        data: [
          notas.filter((nota) => nota < 3).length,
          notas.filter((nota) => nota >= 3 && nota < 5).length,
          notas.filter((nota) => nota >= 5 && nota < 8).length,
          notas.filter((nota) => nota >= 8).length,
        ],
        backgroundColor: ["#D1495B", "#F7E06C", "#4bc0c0ff", "#3A6EA5"],
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
