import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getNotasByMateriaTipoAndBimestre } from "../../services/notasService";

ChartJS.register(ArcElement, Tooltip, Legend);

const NotasOverviewChart = ({
  materia,
  tipo = "",
  bimestre = "",
  label = "Distribuição de Frequência das Notas",
}) => {
  const tipoFilter = tipo && tipo !== "All" ? tipo : undefined;
  const bimestreFilter =
    bimestre && bimestre !== "All" ? Number(bimestre) : undefined;

  const notas = getNotasByMateriaTipoAndBimestre(
    materia,
    tipoFilter,
    bimestreFilter
  );

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
