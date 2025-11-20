import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { useDownload } from "../context/DownloadContext";

import criancasImg from "../assets/images/criancas.jpg";
import livrosImg from "../assets/images/livros.png";
import relatorioImg from "../assets/images/relatorio.webp";
import estudandoImg from "../assets/images/dedicada.webp";
import professorImg from "../assets/images/professor.png";

const Inicial = () => {
  const { startDownload } = useDownload();

  const imgStyle = {
    height: "8rem",
    width: "8rem",
    objectFit: "contain",
    borderRadius: "1rem",
  };

  const handleDownloadClick = () => {
    startDownload();
  };

  return (
    <>
      <div className="bg-fundo"></div>
      <Navbar />

      <div className="container mt-5">
        <header className="text-center mb-4">
          <h1 className="montserrat-bold mb-1">Inicial</h1>
        </header>

        <div className="row row-cols-1 row-cols-sm-2 g-4">
          <div className="col">
            <Link
              to="/turma"
              className="text-decoration-none position-relative d-block"
            >
              <div className="card h-100 rounded-4 card-zoom" id="cards-col-1">
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <img
                    src={criancasImg}
                    alt="Turma"
                    style={imgStyle}
                    className="mb-3"
                  />
                  <span className="montserrat-bold fs-3 text-white">Turma</span>
                </div>
                <span className="stretched-link" />
              </div>
            </Link>
          </div>

          <div className="col">
            <Link
              to="/materias"
              className="text-decoration-none position-relative d-block"
            >
              <div className="card h-100 rounded-4 card-zoom" id="cards-col-2">
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <img
                    src={livrosImg}
                    alt="Matérias"
                    style={imgStyle}
                    className="mb-3"
                  />
                  <span className="montserrat-bold fs-3 text-white">
                    Matérias
                  </span>
                </div>
                <span className="stretched-link" />
              </div>
            </Link>
          </div>

          <div className="col">
            <Link
              to="/alunos"
              className="text-decoration-none position-relative d-block"
            >
              <div className="card h-100 rounded-4 card-zoom" id="cards-col-3">
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <img
                    src={estudandoImg}
                    alt="Alunos"
                    style={imgStyle}
                    className="mb-3"
                  />
                  <span className="montserrat-bold fs-3 text-white">
                    Alunos
                  </span>
                </div>
                <span className="stretched-link" />
              </div>
            </Link>
          </div>

          <div className="col">
            <div
              className="position-relative d-block"
              role="button"
              tabIndex={0}
              onClick={handleDownloadClick}
            >
              <div className="card h-100 rounded-4 card-zoom" id="cards-col-4">
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <img
                    src={relatorioImg}
                    alt="Relatório"
                    style={imgStyle}
                    className="mb-3"
                  />
                  <span className="montserrat-bold fs-3 text-white">
                    Relatório
                  </span>
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
            src={professorImg}
            alt="Professor"
            style={{
              height: "250px",
              width: "250px",
              objectFit: "contain",
              marginTop: 0,
            }}
          />
        </footer>
      </div>
    </>
  );
};

export default Inicial;
