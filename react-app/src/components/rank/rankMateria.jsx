import { useState, useEffect } from "react";
import { getMediaForEachMateria } from "../../services/notasService";

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
            <h5 className="card-title">Ranking da Matéria</h5>
            <span id="ranking-materia" className="fs-4">
              {ranking.find((r) => r.materia === materia.materia)?.rank ||
                "N/A"}
              º de {ranking.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankMateria;
