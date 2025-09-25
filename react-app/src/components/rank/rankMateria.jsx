import { useState, useEffect } from "react";
import { getMediaForEachMateria } from "../../services/notasService";
import trofeuIcon from "../../assets/images/trofeu.webp";

const calcularRankingMateria = () => {
  const mediasMaterias = getMediaForEachMateria();
  mediasMaterias.sort((a, b) => b.media - a.media);
  const ranking = mediasMaterias.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
  return ranking;
};

const RankMateria = (materia) => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const newRanking = calcularRankingMateria();
    setRanking(newRanking);
  }, [materia]);

  return (
    <div className="col-md-6">
      <div className="card mb-3">
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <h5 className="card-title">Ranking da materia</h5>
            <span id="ranking-materia" className="fs-4">
              {ranking.find((r) => r.materia === materia.materia)?.rank ||
                "N/A"}
              º de {ranking.length}
            </span>
          </div>
          <img
            src={trofeuIcon}
            alt="Troféu"
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

export default RankMateria;
