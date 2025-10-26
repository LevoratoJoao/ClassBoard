import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilterPanelMateria from "../components/filters/filterPanelMateria";
import NotasOverviewChart from "../components/charts/notasOverviewChart";
import NotasAvaliacoesChart from "../components/charts/notasAvaliacoesChart";
import NotasPorAvaliacaoChart from "../components/charts/notasPorAvaliacaoChart";
import { buildMateriaAiAnalysis } from "../services/aiService";
import Navbar from "./navbar";
import RankMateria from "../components/rank/rankMateria";
import ListAvaliacoes from "../components/listAvaliacoes/listAvaliacoes";
import MediaMateria from "../components/mediaCard/mediaMateria";
import criancasFooter from "../assets/images/criancas.jpg";

const MateriaDetails = () => {
  const { materia } = useParams();
  const [filters, setFilters] = useState({ bimestre: "All", tipo: "All" });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadAnalysis = async () => {
      if (!materia) return;

      setAiLoading(true);
      const analysis = await buildMateriaAiAnalysis(materia);

      if (!isCancelled) {
        setAiAnalysis(analysis);
        setAiLoading(false);
      }
    };

    loadAnalysis();

    return () => {
      isCancelled = true;
    };
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
      <div className="bg-fundo"></div>
      <Navbar currentMateria={materia} />

      <div className="container mt-4 mb-5">
        <h1 className="mb-4 text-center">
          {materia || "Matéria não encontrada"}
        </h1>

        <div className="row">
          <ListAvaliacoes materia={materia} filters={filters} />
        </div>

        <div className="row">
          <MediaMateria materia={materia} />
          <RankMateria materia={materia} />
        </div>

        <div className="row">
          <div className="col-md-3">
            <FilterPanelMateria onFiltersChange={handleFiltersChange} />
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
                  <NotasPorAvaliacaoChart
                    materia={materia}
                    chartType={getChartType(filters.bimestre, filters.tipo)}
                    tipo={filters.tipo}
                    bimestre={filters.bimestre}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Análise da IA</h5>
                {aiLoading ? (
                  <div className="mt-3">
                    <div className="placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </div>
                    <div className="placeholder-glow mt-2">
                      <span className="placeholder col-12"></span>
                      <span className="placeholder col-10 mt-1"></span>
                      <span className="placeholder col-9 mt-1"></span>
                    </div>
                    <div className="placeholder-glow mt-3">
                      <span className="placeholder col-11"></span>
                      <span className="placeholder col-8 mt-1"></span>
                      <span className="placeholder col-10 mt-1"></span>
                    </div>
                  </div>
                ) : aiAnalysis ? (
                  <>
                    <div className="mt-3">{aiAnalysis.summary}</div>
                    <div
                      className="mt-3"
                      dangerouslySetInnerHTML={{ __html: aiAnalysis.comment }}
                    />
                  </>
                ) : (
                  <div className="mt-3 text-muted">Análise não disponível</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer
        className="text-center py-4"
        style={{ background: "transparent" }}
      >
        <img
          src={criancasFooter}
          alt="Crianças"
          style={{
            height: "300px",
            width: "300px",
            objectFit: "contain",
            marginTop: "0px",
          }}
        />
      </footer>
    </>
  );
};

export default MateriaDetails;
