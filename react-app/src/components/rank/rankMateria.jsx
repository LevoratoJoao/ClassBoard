import { useState, useEffect } from "react";
import { notasAPI } from "../../services/apiService";
import trofeuIcon from "../../assets/images/trofeu.webp";

const RankMateria = ({ materia }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcularRankingMateria = async () => {
      try {
        setLoading(true);

        // Buscar todas as notas de todas as matérias usando o mesmo método
        const allNotas = await notasAPI.getAllNotas();

        const materias = [...new Set(allNotas.map((n) => n.avaliacao.materia))];

        // Calcular médias por matéria usando o mesmo método que os outros componentes
        const mediasMaterias = await Promise.all(
          materias.map(async (mat) => {
            const notasMateria = await notasAPI.filterNotas(mat);
            const media =
              notasMateria.length > 0
                ? (
                    notasMateria.reduce((sum, n) => sum + n.nota, 0) /
                    notasMateria.length
                  ).toFixed(2)
                : 0;
            return { materia: mat, media: parseFloat(media) };
          })
        );

        mediasMaterias.sort((a, b) => b.media - a.media);
        const ranking = mediasMaterias.map((item, index) => ({
          ...item,
          rank: index + 1,
        }));

        setRanking(ranking);
      } catch (error) {
        console.error("Erro ao calcular ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    calcularRankingMateria();
  }, []);

  return (
    <div className="col-md-6">
      <div className="card mb-3">
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <h5 className="card-title">Ranking da materia</h5>
            <span id="ranking-materia" className="fs-4">
              {loading
                ? "..."
                : ranking.find((r) => r.materia === materia)?.rank || "N/A"}
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
