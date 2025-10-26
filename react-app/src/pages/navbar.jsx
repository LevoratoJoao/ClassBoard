import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UploadNotaModal from "../components/UploadNotaModal";
import UploadAlunoModal from "../components/UploadAlunoModal";
import Toast from "../components/Toast";
import logo from "../assets/images/logo.png";
import graficoIcon from "../assets/images/grafico.webp";
import saidaIcon from "../assets/images/saida.webp";
import { handleDownloadRelatorio } from "../utils/handleDownloadRelatorio";

const Navbar = ({ currentMateria }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotaModal, setShowNotaModal] = useState(false);
  const [showAlunoModal, setShowAlunoModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const isAuthenticated = !!user;
  const logoTo = isAuthenticated ? "/inicial" : "/";
  const showUploadNotaButton = location.pathname.includes("/materia/");
  const showUploadAlunoButton = location.pathname === "/alunos";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUploadNotaClick = () => {
    setShowNotaModal(true);
  };

  const handleUploadAlunoClick = () => {
    setShowAlunoModal(true);
  };

  const handleNotaModalSubmit = async (formData) => {
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
        showToast("Nota adicionada com sucesso!");
        setShowNotaModal(false);
        window.location.reload();
      } else {
        showToast("Erro ao adicionar nota", "error");
      }
    } catch (error) {
      showToast("Erro de conexão", "error");
    }
  };

  const handleAlunoModalSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Aluno adicionado com sucesso!");
        setShowAlunoModal(false);
        window.location.reload();
      } else {
        showToast("Erro ao adicionar aluno", "error");
      }
    } catch (error) {
      showToast("Erro de conexão", "error");
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
            {showUploadNotaButton && (
              <button
                type="button"
                className="btn btn-navbar montserrat-bold fs-5 px-4 py-2 me-2"
                onClick={handleUploadNotaClick}
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
            {showUploadAlunoButton && (
              <button
                type="button"
                className="btn btn-navbar montserrat-bold fs-5 px-4 py-2 me-2"
                onClick={handleUploadAlunoClick}
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
                Adicionar Aluno
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

      {showUploadNotaButton && (
        <UploadNotaModal
          show={showNotaModal}
          onClose={() => setShowNotaModal(false)}
          onSubmit={handleNotaModalSubmit}
          defaultMateria={currentMateria}
        />
      )}

      {showUploadAlunoButton && (
        <UploadAlunoModal
          show={showAlunoModal}
          onClose={() => setShowAlunoModal(false)}
          onSubmit={handleAlunoModalSubmit}
        />
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default Navbar;
