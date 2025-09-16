import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterPanel from "../components/filters/filterPanel";
import MediaNotasChart from "../components/charts/mediaNotasChart";
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
                  <MediaNotasChart
                    materia={materia}
                    chartType={
                      filters.bimestre === "All" && filters.tipo === "All"
                        ? "ALL_NOTES"
                        : "BY_TYPE"
                    }
                    tipo={filters.tipo}
                    bimestre={filters.bimestre}
                  />
                  {/* Add other charts here */}
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
