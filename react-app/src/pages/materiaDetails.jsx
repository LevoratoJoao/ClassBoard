import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterPanel from "../components/filters/filterPanel";
import NotasOverviewChart from "../components/charts/notasOverviewChart";
import NotasAvaliacoesChart from "../components/charts/notasAvaliacoesChart";
import NotasPorAlunosChart from "../components/charts/notasPorAlunosChart";
import { buildAiAnalysis } from "../services/aiService";
import Navbar from "./navbar";

const MateriaDetails = () => {
  const { materia } = useParams();
  const [filters, setFilters] = useState({ bimestre: "All", tipo: "All" });
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    const analysis = buildAiAnalysis(materia);
    setAiAnalysis(analysis);
  }, [materia]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getChartType = (bimestre, tipo) => {
    if (bimestre !== "All" && tipo !== "All") return "BY_TYPE_AND_BIMESTER";
    if (bimestre !== "All" && tipo === "All") return "BY_BIMESTER";
    if (tipo !== "All" && bimestre === "All") return "BY_TYPE";
    return "ALL_NOTES";
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5">
        <h1 className="mb-4 text-center">
          {materia || "Matéria não encontrada"}
        </h1>

        <div className="row">
          <div className="col-md-3">
            <FilterPanel onFiltersChange={handleFiltersChange} />
          </div>

          <div className="col-md-9">
            <div
              className="card mb-4"
              style={{ maxHeight: "512px", overflowY: "auto" }}
            >
              <div className="card-body">
                <h5 className="card-title text-center">Gráficos</h5>
                <hr />
                <div className="d-flex flex-column align-items-center">
                  <NotasOverviewChart
                    materia={materia}
                    chartType={getChartType(filters.bimestre, filters.tipo)}
                    tipo={filters.tipo}
                    bimestre={filters.bimestre}
                  />
                  <NotasAvaliacoesChart
                    materia={materia}
                    chartType={getChartType(filters.bimestre, filters.tipo)}
                    tipo={filters.tipo}
                    bimestre={filters.bimestre}
                  />
                  <NotasPorAlunosChart
                    materia={materia}
                    chartType={getChartType(filters.bimestre, filters.tipo)}
                    tipo={filters.tipo}
                    bimestre={filters.bimestre}
                  />
                </div>
              </div>
            </div>

            {aiAnalysis && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Análise da IA</h5>
                  <div className="mt-3">{aiAnalysis.summary}</div>
                  <div
                    className="mt-3"
                    dangerouslySetInnerHTML={{ __html: aiAnalysis.comment }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MateriaDetails;
