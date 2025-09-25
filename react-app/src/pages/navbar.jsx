import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import graficoIcon from "../assets/images/grafico.webp";

const Navbar = () => {
  return (
    <nav className="navbar bg-body-tertiary navbar-expand-lg py-3">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" style={{ height: "64px" }} />
        </Link>
        <ul className="nav nav-fill fs-5">
          <li className="nav-item">
            <Link
              className="nav-link active montserrat-bold"
              aria-current="page"
              to="#"
            >
              Turma
            </Link>
          </li>
          <li className="nav-item ms-3">
            <Link className="nav-link montserrat-bold" to="/">
              Matéria
            </Link>
          </li>
          <li className="nav-item ms-3">
            <Link className="nav-link montserrat-bold" to="/alunos">
              Alunos
            </Link>
          </li>
          <li className="nav-item ms-3">
            <Link
              className="nav-link disabled montserrat-bold"
              aria-disabled="true"
              to="#"
            >
              Relatório
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="btn btn-upload montserrat-bold fs-5 px-4 py-2 me-2"
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
      </div>
    </nav>
  );
};

export default Navbar;
