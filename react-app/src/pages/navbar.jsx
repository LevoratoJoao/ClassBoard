import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDownload } from "../context/DownloadContext";
import UploadAlunoModal from "../components/UploadAlunoModal";
import Toast from "../components/Toast";
import logo from "../assets/images/logo.png";
import graficoIcon from "../assets/images/grafico.webp";
import saidaIcon from "../assets/images/saida.webp";
import BulkUploadNotaModal from "../components/BulkUploadNotaModal";

const Navbar = ({ currentMateria }) => {
  const { user, logout } = useAuth();
  const { startDownload } = useDownload();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotaModal, setShowNotaModal] = useState(false);
  const [showAlunoModal, setShowAlunoModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Verifica se usuário está autenticado
  const isAuthenticated = !!user;
  const logoTo = isAuthenticated ? "/inicial" : "/";

  // Controla visibilidade dos botões baseado na rota atual
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

  // Processa envio de múltiplas notas
  const handleNotaModalSubmit = async (notasData) => {
    try {
      // Cria promessas para todas as notas
      const promises = notasData.map((formData) =>
        fetch("http://localhost:8000/notas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(formData),
        })
      );

      // Aguarda todas as requisições
      const responses = await Promise.all(promises);
      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        showToast(`${notasData.length} notas adicionadas com sucesso!`);
        setShowNotaModal(false);
        window.location.reload(); // Recarrega para mostrar novas notas
      } else {
        showToast("Erro ao adicionar algumas notas", "error");
      }
    } catch (error) {
      showToast("Erro de conexão", "error");
    }
  };

  // Processa envio de novo aluno
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
        window.location.reload(); // Recarrega para mostrar novo aluno
      } else {
        showToast("Erro ao adicionar aluno", "error");
      }
    } catch (error) {
      showToast("Erro de conexão", "error");
    }
  };

  // Função de download usando contexto global
  const handleDownloadClick = () => {
    startDownload();
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary navbar-expand-lg py-2">
        <div className="container-fluid">
          {/* Logo com link dinâmico */}
          <Link to={logoTo} className="navbar-brand">
            <img src={logo} alt="Logo" style={{ height: "50px" }} />
          </Link>

          {/* Menu de navegação principal */}
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
                onClick={handleDownloadClick}
                style={{ cursor: "pointer" }}
              >
                Relatório
              </button>
            </li>
          </ul>

          {/* Botões de ação contextuais */}
          <div className="d-flex align-items-center">
            {/* Botão de upload de notas - só aparece em páginas de matéria */}
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
            {/* Botão de adicionar aluno - só aparece na página de alunos */}
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
            {/* Botão de logout */}
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

      {/* Modais condicionais */}
      {showUploadNotaButton && (
        <BulkUploadNotaModal
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

      {/* Toast para feedback */}
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
