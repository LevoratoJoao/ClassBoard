import { Link } from "react-router-dom";
import Navbar from "./navbar";

const MateriaListagem = () => {
  const materias = [
    {
      name: "Portugues",
      displayName: "Português",
      icon: "book_3",
      cardClass: "cards-col-1",
    },
    {
      name: "Matematica",
      displayName: "Matemática",
      icon: "calculate",
      cardClass: "cards-col-2",
    },
    {
      name: "Artes",
      displayName: "Artes",
      icon: "format_paint",
      cardClass: "cards-col-3",
    },
    {
      name: "Historia",
      displayName: "História",
      icon: "history_edu",
      cardClass: "cards-col-1",
    },
    {
      name: "Geografia",
      displayName: "Geografia",
      icon: "globe",
      cardClass: "cards-col-2",
    },
    {
      name: "Ciencias",
      displayName: "Ciencias",
      icon: "science",
      cardClass: "cards-col-3",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h1 className="mb-4 text-center montserrat-bold">Matérias da turma</h1>

        <div className="row justify-content-center mb-4">
          {materias.slice(0, 3).map((materia, _) => (
            <div key={materia.name} className="col-md-4 mb-4">
              <div className={`card h-100 rounded-4`} id={materia.cardClass}>
                <div className="card-body d-flex flex-column align-items-center justify-content-start">
                  <span
                    className="material-symbols-outlined card-title mb-4"
                    id="icons"
                  >
                    {materia.icon}
                  </span>
                  <Link
                    className="card-text montserrat-bold fs-3"
                    to={`/materia/${materia.name}`}
                    style={{ textDecoration: "none" }}
                  >
                    {materia.displayName}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-4">
          {materias.slice(3, 6).map((materia, _) => (
            <div key={materia.name} className="col-md-4 mb-4">
              <div className={`card h-100 rounded-4`} id={materia.cardClass}>
                <div className="card-body d-flex flex-column align-items-center justify-content-start">
                  <span
                    className="material-symbols-outlined card-title mb-4"
                    id="icons"
                  >
                    {materia.icon}
                  </span>
                  <Link
                    className="card-text montserrat-bold fs-3"
                    to={`/materia/${materia.name}`}
                    style={{ textDecoration: "none" }}
                  >
                    {materia.displayName}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MateriaListagem;
