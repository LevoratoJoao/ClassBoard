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
  getNotasByMateriaTipoAndBimestre,
} from "../../services/notasService";

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
      const notas = getNotasByMateriaTipoAndBimestre(
        materia,
        tipoItem,
        bimestreItem
      );
      if (!notas.length) return null;
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      return Number(media.toFixed(2));
    });
    return {
      label: tipoItem,
      data,
      backgroundColor:
        idx === 0 ? "rgba(54, 162, 235, 0.7)" : "rgba(255, 99, 132, 0.7)",
    };
  });

  const data = {
    labels: bimestresToShow.map((b) => `Bimestre ${b}`),
    datasets,
  };

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
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default NotasPorAvaliacaoChart;
