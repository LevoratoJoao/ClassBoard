import { useState, useEffect } from "react";
import { alunos } from "../data/alunos";
import {
  getMediaByAlunoForEachMateria,
  getMediaForEachAluno,
} from "../services/notasService";

export const useAlunosList = () => {
  const [alunosData, setAlunosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("nome"); // nome, media, ranking
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  useEffect(() => {
    const loadAlunosData = async () => {
      try {
        setLoading(true);
        setError(null);

        const mediasAlunos = getMediaForEachAluno();
        const alunosOrdenados = [...mediasAlunos].sort(
          (a, b) => b.media - a.media
        );

        const alunosEnriquecidos = alunos.map((aluno) => {
          const mediaAluno = mediasAlunos.find(
            (m) =>
              m.aluno
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "") ===
              aluno.nome
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
          );

          const posicaoRanking = alunosOrdenados.findIndex(
            (a) =>
              a.aluno
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "") ===
              aluno.nome
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
          );

          const media =
            mediaAluno && typeof mediaAluno.media === "number"
              ? mediaAluno.media
              : 0;
          const ranking = posicaoRanking >= 0 ? posicaoRanking + 1 : null;
          const totalAlunos = alunosOrdenados.length;

          let corRanking = "#6c757d";
          if (ranking && totalAlunos) {
            const percentualTop = (ranking / totalAlunos) * 100;
            if (percentualTop <= 10) corRanking = "#28a745";
            else if (percentualTop <= 25) corRanking = "#20c997";
            else if (percentualTop <= 50) corRanking = "#ffc107";
            else if (percentualTop <= 75) corRanking = "#fd7e14";
            else corRanking = "#dc3545";
          }

          return {
            ...aluno,
            media: media && !isNaN(media) ? Number(media).toFixed(2) : "0.00",
            ranking,
            totalAlunos,
            corRanking,
            rankingTexto: ranking ? `${ranking}º de ${totalAlunos}` : "N/A",
          };
        });

        setAlunosData(alunosEnriquecidos);
      } catch (err) {
        setError(err.message || "Erro ao carregar lista de alunos");
        console.error("Erro no useAlunosList:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAlunosData();
  }, []);

  const sortAlunos = (alunos, by, order) => {
    return [...alunos].sort((a, b) => {
      let comparison = 0;

      switch (by) {
        case "nome":
          comparison = a.nome.localeCompare(b.nome);
          break;
        case "media":
          comparison = a.media - b.media;
          break;
        case "ranking":
          comparison = (a.ranking || Infinity) - (b.ranking || Infinity);
          break;
        default:
          return 0;
      }

      return order === "asc" ? comparison : -comparison;
    });
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const alunosOrdenados = sortAlunos(alunosData, sortBy, sortOrder);

  return {
    alunos: alunosOrdenados,
    loading,
    error,
    sortBy,
    sortOrder,
    handleSort,
    totalAlunos: alunosData.length,
  };
};

export default useAlunosList;
