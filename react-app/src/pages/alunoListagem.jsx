import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { useAlunosList } from "../hooks/useAlunosList";
import boyIcon from "../assets/images/boy.webp";
import girlIcon from "../assets/images/girl.webp";
import alunosFooter from "../assets/images/alunos.webp";

const AlunoListagem = () => {
  const { alunos, loading, error, sortBy, sortOrder, handleSort, totalAlunos } =
    useAlunosList();

  if (loading) {
    return (
      <>
        <div className="bg-fundo"></div>
        <Navbar />
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <h2 className="mt-3">Carregando alunos...</h2>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-fundo"></div>
        <Navbar />
        <div className="container mt-5">
          <h1 className="mb-4 text-center text-danger">Erro: {error}</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-fundo"></div>
      <Navbar />

      <div className="container mt-5">
        <h1 className="mb-4 text-center montserrat-bold">
          Alunos da turma ({totalAlunos})
        </h1>

        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="card sorting-card">
              <div className="card-body">
                <h5 className="card-title">Ordenar por:</h5>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${
                      sortBy === "nome" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => handleSort("nome")}
                  >
                    Nome {sortBy === "nome"}
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      sortBy === "ranking"
                        ? "btn-warning"
                        : "btn-outline-warning"
                    }`}
                    onClick={() => handleSort("ranking")}
                  >
                    Ranking {sortBy === "ranking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mb-4">
          <ul className="list-group mb-4">
            {alunos.map((aluno, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={aluno.sexo === "feminino" ? girlIcon : boyIcon}
                    alt={aluno.sexo === "feminino" ? "Feminino" : "Masculino"}
                    style={{
                      height: "3rem",
                      width: "3rem",
                      objectFit: "contain",
                      marginRight: "12px",
                    }}
                  />
                  <Link
                    className="montserrat-bold fs-4 text-decoration-none"
                    to={`/aluno/${encodeURIComponent(aluno.nome)}`}
                  >
                    {aluno.nome}
                  </Link>
                </div>

                <div className="text-end">
                  <div className="fw-bold" style={{ color: aluno.corRanking }}>
                    {aluno.rankingTexto}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer
        className="text-center py-4"
        style={{ background: "transparent" }}
      >
        <img
          src={alunosFooter}
          alt="Alunos"
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

export default AlunoListagem;
