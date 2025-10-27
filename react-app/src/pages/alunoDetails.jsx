import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import FilterPanelAluno from "../components/filters/filterPanelAluno";
import ComparacaoTurmaChart from "../components/charts/comparacaoTurmaChart";
import EvolucaoNotasChart from "../components/charts/evolucaoNotasChart";
import DistribuicaoNotasChart from "../components/charts/distribuicaoNotasChart";
import NotasIndividuaisChart from "../components/charts/notasIndividuaisChart";
import { useAlunoFilters } from "../hooks/useAlunoFilters";
import { useAlunoData } from "../hooks/useAlunoData";
import { useRanking } from "../hooks/useRanking";
import { buildAlunoAiAnalysis } from "../services/aiService";
import faltaIcon from "../assets/images/falta.webp";
import trofeuIcon from "../assets/images/trofeu.webp";
import cerebroIcon from "../assets/images/cerebro.webp";
import detalhesFooter from "../assets/images/detalhes.webp";

const AlunoDetails = () => {
  const { aluno } = useParams();
  const alunoNome = aluno ? decodeURIComponent(aluno) : "";
  const [filterLoading, setFilterLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  // Hooks
  const { filters, applyFilters } = useAlunoFilters(alunoNome);
  const {
    alunoData,
    mediasMaterias,
    mediasPorBimestre,
    mediaTurma,
    evolucaoData,
    notasValues,
    notasDetalhadas,
    faltasTotais,
    loading: dataLoading,
    error,
    setMediasMaterias,
    setMediaTurma,
    setEvolucaoData,
    setNotasValues,
    setNotasDetalhadas,
    setMediasPorBimestre,
  } = useAlunoData(alunoNome);
  const { ranking, loading: rankingLoading } = useRanking(alunoNome);

  // Carregar análise da IA depois que a página carregar
  useEffect(() => {
    let isCancelled = false;

    const loadAnalysis = async () => {
      if (!alunoData?.id) return;

      setAiLoading(true);
      const analysis = await buildAlunoAiAnalysis(alunoData.id);

      if (!isCancelled) {
        setAiAnalysis(analysis);
        setAiLoading(false);
      }
    };

    // Só carrega a IA depois que os dados do aluno estiverem disponíveis
    if (alunoData && !dataLoading) {
      loadAnalysis();
    }

    return () => {
      isCancelled = true;
    };
  }, [alunoData, dataLoading]);

  const handleFiltersChange = async (newFilters) => {
    
    setFilterLoading(true);
    try {
      await applyFilters(
        newFilters,
        setMediasMaterias,
        setMediaTurma,
        setEvolucaoData,
        setNotasValues,
        setNotasDetalhadas,
        setMediasPorBimestre
      );

      console.log("Filtros aplicados com sucesso");
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  const renderTabelaAprovacao = () => {
    return (
      <div
        style={{ minHeight: "280px", display: "flex", flexDirection: "column" }}
      >
        <div className="table-responsive" style={{ flex: 1 }}>
          <table
            className="table table-bordered table-sm"
            style={{ marginTop: "12px", tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    width: "40%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  Matéria
                </th>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    textAlign: "center",
                    width: "30%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  Média anual
                </th>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    textAlign: "center",
                    width: "30%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  Situação
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mediasMaterias).map(([materia, media]) => {
                const isNA = media === "N/A";
                const mediaNum = isNA ? 0 : parseFloat(media);
                const aprovado = mediaNum >= 6;

                return (
                  <tr key={materia}>
                    <td
                      style={{
                        fontWeight: "500",
                        fontSize: "0.9rem",
                        padding: "8px",
                      }}
                    >
                      {materia}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        color: isNA ? "#6c757d" : "inherit",
                        fontWeight: isNA ? "normal" : "500",
                        fontStyle: isNA ? "italic" : "normal",
                        fontSize: "0.9rem",
                        padding: "8px",
                      }}
                    >
                      {isNA ? "N/A" : media}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        color: isNA
                          ? "#6c757d"
                          : aprovado
                          ? "#1976d2"
                          : "#d32f2f",
                        fontWeight: isNA ? "normal" : "500",
                        fontStyle: isNA ? "italic" : "normal",
                        fontSize: "0.9rem",
                        padding: "8px",
                      }}
                    >
                      {isNA ? "N/A" : aprovado ? "Aprovado" : "Reprovado"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTabelaMediasPorBimestre = () => {
    const materias = Object.keys(mediasPorBimestre);
    if (materias.length === 0) {
      return (
        <div
          className="text-center text-muted"
          style={{
            minHeight: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Nenhum dado disponível</p>
        </div>
      );
    }

    return (
      <div
        style={{ minHeight: "280px", display: "flex", flexDirection: "column" }}
      >
        <div className="table-responsive" style={{ flex: 1 }}>
          <table
            className="table table-bordered table-sm"
            style={{ marginTop: "12px", tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    width: "40%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  Matéria
                </th>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    textAlign: "center",
                    width: "15%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  1º Bim
                </th>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    textAlign: "center",
                    width: "15%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  2º Bim
                </th>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    textAlign: "center",
                    width: "15%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  3º Bim
                </th>
                <th
                  className="montserrat"
                  style={{
                    fontWeight: "500",
                    textAlign: "center",
                    width: "15%",
                    fontSize: "0.9rem",
                    padding: "8px",
                  }}
                >
                  4º Bim
                </th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => {
                return (
                  <tr key={materia}>
                    <td
                      style={{
                        fontWeight: "500",
                        fontSize: "0.9rem",
                        padding: "8px",
                      }}
                    >
                      {materia}
                    </td>
                    {[1, 2, 3, 4].map((bimestre) => {
                      const bimestreKey = `bimestre${bimestre}`;
                      const mediaBim =
                        mediasPorBimestre[materia]?.[bimestreKey] || "N/A";
                      const isNABim = mediaBim === "N/A";
                      const mediaNum = isNABim ? 0 : parseFloat(mediaBim);

                      return (
                        <td
                          key={bimestre}
                          style={{
                            textAlign: "center",
                            color: isNABim
                              ? "#6c757d"
                              : mediaNum >= 6
                              ? "#1976d2"
                              : "#d32f2f",
                            fontWeight: isNABim ? "normal" : "500",
                            fontStyle: isNABim ? "italic" : "normal",
                            fontSize: "0.9rem",
                            padding: "8px",
                          }}
                        >
                          {isNABim ? "N/A" : mediaBim}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (dataLoading || rankingLoading) {
    return (
      <>
        <div className="bg-fundo"></div>
        <Navbar />
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <h2 className="mt-3">Carregando dados do aluno...</h2>
          </div>
        </div>
      </>
    );
  }

  if (error || !alunoData) {
    return (
      <>
        <div className="bg-fundo"></div>
        <Navbar />
        <div className="container mt-5">
          <h1 className="mb-4 text-center">
            {error ? `Erro: ${error}` : "Aluno não encontrado"}
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-fundo"></div>
      <Navbar />

      <div className="container mt-5">
        <h1 className="mb-4 text-center">{alunoData.nome}</h1>

        <div className="row mb-4">
          <div className="col-lg-7 col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Médias por Bimestre</h5>
                {renderTabelaMediasPorBimestre()}
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Aprovação anual por matéria</h5>
                {renderTabelaAprovacao()}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title">Quantidade de faltas totais</h5>
                  <span className="fs-4">{faltasTotais} faltas</span>
                </div>
                <img
                  src={faltaIcon}
                  alt="Faltas"
                  style={{
                    height: "80px",
                    width: "80px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title">Ranking do aluno na turma</h5>
                  <span className="fs-4">{ranking}</span>
                </div>
                <img
                  src={trofeuIcon}
                  alt="Troféu"
                  style={{
                    height: "80px",
                    width: "80px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4 mb-5">
        <div className="row">
          <div className="col-md-3">
            <FilterPanelAluno onFiltersChange={handleFiltersChange} />
          </div>
          <div className="col-md-9">
            {filterLoading && (
              <div className="text-center mb-3">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Aplicando filtros...</span>
                </div>
                <small className="text-muted">Aplicando filtros...</small>
              </div>
            )}
            <div
              className="card mb-4"
              style={{ maxHeight: "512px", overflowY: "auto" }}
            >
              <div className="card-body">
                <h5 className="card-title text-center">Gráficos</h5>
                <hr />
                <div className="d-flex flex-column align-items-center">
                  <ComparacaoTurmaChart
                    mediasMaterias={mediasMaterias}
                    mediasTurma={mediaTurma}
                  />
                  <EvolucaoNotasChart evolucaoData={evolucaoData} />
                  <DistribuicaoNotasChart notasAluno={notasValues} />
                  <NotasIndividuaisChart notasDetalhadas={notasDetalhadas} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
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
                    <div className="mt-3 text-muted">
                      Análise não disponível
                    </div>
                  )}
                </div>
                <img
                  src={cerebroIcon}
                  alt="IA"
                  style={{
                    height: "80px",
                    width: "80px",
                    objectFit: "contain",
                  }}
                />
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
          src={detalhesFooter}
          alt="Detalhes"
          style={{
            height: "250px",
            width: "250px",
            objectFit: "contain",
            marginTop: "0px",
          }}
        />
      </footer>
    </>
  );
};

export default AlunoDetails;
