import { Link } from "react-router-dom";
import Navbar from "./navbar";
import portIcon from "../assets/images/port.webp";
import mathIcon from "../assets/images/math.png";
import artesIcon from "../assets/images/artes.webp";
import histIcon from "../assets/images/hist.webp";
import geoIcon from "../assets/images/geo.webp";
import cienciasIcon from "../assets/images/ciencias.webp";

const MateriaListagem = () => {
  const materias = [
    {
      name: "Portugues",
      displayName: "Português",
      image: portIcon,
      alt: "Português",
      cardClass: "cards-col-1",
    },
    {
      name: "Matematica",
      displayName: "Matemática",
      image: mathIcon,
      alt: "Matemática",
      cardClass: "cards-col-2",
    },
    {
      name: "Artes",
      displayName: "Artes",
      image: artesIcon,
      alt: "Artes",
      cardClass: "cards-col-3",
    },
    {
      name: "Historia",
      displayName: "História",
      image: histIcon,
      alt: "História",
      cardClass: "cards-col-1",
    },
    {
      name: "Geografia",
      displayName: "Geografia",
      image: geoIcon,
      alt: "Geografia",
      cardClass: "cards-col-2",
    },
    {
      name: "Ciencias",
      displayName: "Ciencias",
      image: cienciasIcon,
      alt: "Ciencias",
      cardClass: "cards-col-3",
    },
  ];

  return (
    <>
      <div className="bg-fundo"></div>
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
                    <img
                      src={materia.image}
                      alt={materia.alt}
                      style={{
                        height: "8rem",
                        width: "8rem",
                        objectFit: "contain",
                        marginBottom: "0px",
                      }}
                    />
                  </span>
                  <Link
                    className="card-text montserrat-bold fs-3"
                    to={`/materia/${materia.name}`}
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
                    <img
                      src={materia.image}
                      alt={materia.alt}
                      style={{
                        height: "8rem",
                        width: "8rem",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <Link
                    className="card-text montserrat-bold fs-3"
                    to={`/materia/${materia.name}`}
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
