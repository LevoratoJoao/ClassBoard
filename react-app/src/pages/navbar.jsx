import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logo.png";
import graficoIcon from "../assets/images/grafico.webp";
import saidaIcon from "../assets/images/saida.webp";
import { handleDownloadRelatorio } from "../utils/handleDownloadRelatorio";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = !!user;
  const logoTo = isAuthenticated ? "/inicial" : "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar bg-body-tertiary navbar-expand-lg py-2">
      <div className="container-fluid">
        <Link to={logoTo} className="navbar-brand">
          <img src={logo} alt="Logo" style={{ height: "50px" }} />
        </Link>

        <ul className="nav nav-fill fs-5">
          <li className="nav-item">
            <Link className="nav-link active montserrat-bold" aria-current="page" to="/turma">
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
          <button type="button" className="btn btn-navbar montserrat-bold fs-5 px-4 py-2 me-2">
            <img
              src={graficoIcon}
              alt="Gráfico"
              style={{ height: "32px", width: "32px", marginRight: "10px", verticalAlign: "middle" }}
            />
            Upload
          </button>
          <button
            type="button"
            className="btn btn-navbar montserrat-bold fs-5 px-4 py-2 me-2"
            onClick={handleLogout}
          >
            <img
              src={saidaIcon}
              alt="Sair"
              style={{ height: "32px", width: "32px", marginRight: "10px", verticalAlign: "middle" }}
            />
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;