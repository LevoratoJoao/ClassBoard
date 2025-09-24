import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import FilterPanelAluno from "../components/filters/filterPanelAluno";
import ComparacaoTurmaChart from "../components/charts/comparacaoTurmaChart";
import EvolucaoNotasChart from "../components/charts/evolucaoNotasChart";
import DistribuicaoNotasChart from "../components/charts/distribuicaoNotasChart";
import { useAlunoFilters } from "../hooks/useAlunoFilters";
import { useAlunoData } from "../hooks/useAlunoData";
import { useRanking } from "../hooks/useRanking";
import faltaIcon from "../assets/images/falta.webp";
import trofeuIcon from "../assets/images/trofeu.webp";
import cerebroIcon from "../assets/images/cerebro.webp";
import detalhesFooter from "../assets/images/detalhes.webp";

const AlunoDetails = () => {
  const { aluno } = useParams();
  const alunoNome = aluno ? decodeURIComponent(aluno) : "";

  // Hooks personalizados
  const { filters, applyFilters } = useAlunoFilters(alunoNome);
  const {
    alunoData,
    mediasMaterias,
    mediaTurma,
    evolucaoData,
    notasValues,
    aiAnalysis,
    faltasTotais,
    loading: dataLoading,
    error,
    setMediasMaterias,
    setMediaTurma,
    setEvolucaoData,
    setNotasValues,
  } = useAlunoData(alunoNome);
  const { ranking, loading: rankingLoading } = useRanking(alunoNome);

  const handleFiltersChange = (newFilters) => {
    applyFilters(
      newFilters,
      setMediasMaterias,
      setMediaTurma,
      setEvolucaoData,
      setNotasValues
    );
  };

  const renderTabelaAprovacao = () => {
    return (
      <table
        className="table table-bordered table-sm"
        style={{ marginTop: "12px" }}
      >
        <thead>
          <tr>
            <th className="montserrat" style={{ fontWeight: "500" }}>
              Matéria
            </th>
            <th className="montserrat" style={{ fontWeight: "500" }}>
              Média anual
            </th>
            <th className="montserrat" style={{ fontWeight: "500" }}>
              Situação
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mediasMaterias).map(([materia, media]) => {
            const aprovado = media >= 6;
            return (
              <tr key={materia}>
                <td>{materia}</td>
                <td>{media}</td>
                <td
                  style={{
                    color: aprovado ? "#1976d2" : "#d32f2f",
                    fontWeight: "bold",
                  }}
                >
                  {aprovado ? "Aprovado" : "Reprovado"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
          <div className="col-md-6">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Nota média em cada Matéria</h5>
                <ul className="list-group">
                  {Object.entries(mediasMaterias).map(([materia, media]) => (
                    <li key={materia} className="list-group-item">
                      {materia}: {media}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-3">
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
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title">Análise da IA</h5>
                  {aiAnalysis && (
                    <>
                      <div className="mt-3">{aiAnalysis.summary}</div>
                      <div
                        className="mt-3"
                        dangerouslySetInnerHTML={{ __html: aiAnalysis.comment }}
                      />
                    </>
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
