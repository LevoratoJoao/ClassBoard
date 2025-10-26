import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UploadNotaModal from "../components/UploadNotaModal";
import logo from "../assets/images/logo.png";
import graficoIcon from "../assets/images/grafico.webp";
import saidaIcon from "../assets/images/saida.webp";
import { handleDownloadRelatorio } from "../utils/handleDownloadRelatorio";

const Navbar = ({ currentMateria }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const isAuthenticated = !!user;
  const logoTo = isAuthenticated ? "/inicial" : "/";
  const showUploadButton = location.pathname.includes("/materia/");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUploadClick = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/notas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Nota adicionada com sucesso!");
        setShowModal(false);
        window.location.reload(); // Refresh to show new data
      } else {
        alert("Erro ao adicionar nota");
      }
    } catch (error) {
      alert("Erro de conexão");
    }
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary navbar-expand-lg py-2">
        <div className="container-fluid">
          <Link to={logoTo} className="navbar-brand">
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
          </Link>

          <ul className="nav nav-fill fs-5">
            <li className="nav-item">
              <Link
                className="nav-link active montserrat-bold"
                aria-current="page"
                to="/turma"
              >
                Turma
              </Link>
            </li>
            <li className="nav-item ms-3">
              <Link className="nav-link montserrat-bold" to="/materias">
                Matéria
              </Link>
            </li>
            <li className="nav-item ms-3">
              <Link className="nav-link montserrat-bold" to="/alunos">
                Alunos
              </Link>
            </li>
            <li className="nav-item ms-3">
              <button
                className="nav-link montserrat-bold btn btn-link"
                onClick={handleDownloadRelatorio}
                style={{ cursor: "pointer" }}
              >
                Relatório
              </button>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {showUploadButton && (
              <button
                type="button"
                className="btn btn-navbar montserrat-bold fs-5 px-4 py-2 me-2"
                onClick={handleUploadClick}
              >
                <img
                  src={graficoIcon}
                  alt="Gráfico"
                  style={{
                    height: "32px",
                    width: "32px",
                    marginRight: "10px",
                    verticalAlign: "middle",
                  }}
                />
                Upload
              </button>
            )}
            <button
              type="button"
              className="btn btn-navbar montserrat-bold fs-5 px-4 py-2 me-2"
              onClick={handleLogout}
            >
              <img
                src={saidaIcon}
                alt="Sair"
                style={{
                  height: "32px",
                  width: "32px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                }}
              />
              Sair
            </button>
          </div>
        </div>
      </nav>

      {showUploadButton && (
        <UploadNotaModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
          defaultMateria={currentMateria}
        />
      )}
    </>
  );
};

export default Navbar;
