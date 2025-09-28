import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { handleDownloadRelatorio } from "../utils/handleDownloadRelatorio";

import criancasImg from "../assets/images/criancas.jpg";
import livrosImg from "../assets/images/livros.png";
import relatorioImg from "../assets/images/relatorio.webp";
import estudandoImg from "../assets/images/estudando.png";
import professorImg from "../assets/images/professor.png";

const Inicial = () => {
    const imgStyle = {
        height: "8rem",
        width: "8rem",
        objectFit: "contain",
        borderRadius: "1rem",
        marginBottom: "1rem",
    };

    return (
        <>
            <div className="bg-fundo"></div>
            <Navbar />

            <div className="container mt-5">
                <h1 className="mb-4 text-center montserrat-bold">Inicial</h1>

                <div className="row justify-content-center g-4">
                    <div className="col-sm-6 col-lg-5">
                        <Link to="/turma" className="text-decoration-none position-relative d-block">
                            <div className="card h-100 rounded-4" id="cards-col-1">
                                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                                    <img src={criancasImg} alt="Turma" style={imgStyle} loading="lazy" />
                                    <span className="card-text montserrat-bold fs-3 text-white">Turma</span>
                                </div>
                                <span className="stretched-link" />
                            </div>
                        </Link>
                    </div>

                    <div className="col-sm-6 col-lg-5">
                        <Link to="/materias" className="text-decoration-none position-relative d-block">
                            <div className="card h-100 rounded-4" id="cards-col-2">
                                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                                    <img src={livrosImg} alt="Matérias" style={imgStyle} loading="lazy" />
                                    <span className="card-text montserrat-bold fs-3 text-white">Matérias</span>
                                </div>
                                <span className="stretched-link" />
                            </div>
                        </Link>
                    </div>

                    <div className="col-sm-6 col-lg-5">
                        <Link to="/alunos" className="text-decoration-none position-relative d-block">
                            <div className="card h-100 rounded-4" id="cards-col-3">
                                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                                    <img src={estudandoImg} alt="Alunos" style={imgStyle} loading="lazy" />
                                    <span className="card-text montserrat-bold fs-3 text-white">Alunos</span>
                                </div>
                                <span className="stretched-link" />
                            </div>
                        </Link>
                    </div>

                    <div className="col-sm-6 col-lg-5">
                        <div
                            className="text-decoration-none position-relative d-block"
                            role="button"
                            onClick={handleDownloadRelatorio}
                        >
                            <div className="card h-100 rounded-4" id="cards-col-1">
                                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                                    <img src={relatorioImg} alt="Relatório" style={imgStyle} loading="lazy" />
                                    <span className="card-text montserrat-bold fs-3 text-white">Relatório</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="text-center py-4" style={{ background: "transparent" }}>
                    <img
                        src={professorImg}
                        alt="Professor"
                        style={{ height: "250px", width: "250px", objectFit: "contain", marginTop: 0 }}
                        loading="lazy"
                    />
                </footer>
            </div>
        </>
    );
};

export default Inicial;