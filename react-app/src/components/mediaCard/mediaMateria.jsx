import { useState, useEffect } from "react";
import { getMediaByMateria } from "../../services/notasService";
import faltaIcon from "../../assets/images/falta.webp";

const MediaMateria = ({ materia }) => {
  const [mediaTotal, setMediaTotal] = useState(0);

  useEffect(() => {
    const media = getMediaByMateria(materia);
    setMediaTotal(media);
  }, [materia]);

  return (
    <div className="col-md-6">
      <div className="card mb-3">
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <h5 className="card-title">Media total</h5>
            <span className="fs-4">{mediaTotal} de 10</span>
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
