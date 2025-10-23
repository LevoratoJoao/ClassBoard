import faltaIcon from "../../assets/images/falta.webp";
import { useMediaByMateria } from "../../hooks/useMediaByMateria";

const MediaMateria = ({ materia }) => {
  const { media, loading } = useMediaByMateria(materia);

  return (
    <div className="col-md-6">
      <div className="card mb-3">
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <h5 className="card-title">Media total</h5>
            <span className="fs-4">
              {loading ? "..." : media || "N/A"} de 10
            </span>
          </div>
          <img
            src={faltaIcon}
            alt="Faltas"
            style={{
              height: "80px",
              width: "80px",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MediaMateria;
