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

  useEffect(() => {
    const analysis = buildMateriaAiAnalysis(materia);
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
      <div className="bg-fundo"></div>
      <Navbar />

      <div className="container mt-4 mb-5">
        <h1 className="mb-4 text-center">
          {materia || "Matéria não encontrada"}
        </h1>

        <div className="row">
          <ListAvaliacoes materia={materia} />
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
