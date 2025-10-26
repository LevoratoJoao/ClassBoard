import { useState, useEffect } from "react";
import { alunosAPI, notasAPI } from "../services/apiService";

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

        // Buscar alunos da API
        const alunos = await alunosAPI.getAllAlunos();

        // Buscar todas as notas da API
        const todasNotas = await notasAPI.getAllNotas();

        // Calcular médias por aluno baseado nas notas da API
        const mediasAlunos = {};
        alunos.forEach((aluno) => {
          const notasAluno = todasNotas.filter(
            (nota) => nota.aluno_id === aluno.id
          );
          if (notasAluno.length > 0) {
            const media =
              notasAluno.reduce((sum, nota) => sum + nota.nota, 0) /
              notasAluno.length;
            mediasAlunos[aluno.id] = media;
          } else {
            mediasAlunos[aluno.id] = 0;
          }
        });

        // Ordenar alunos por média para ranking
        const alunosOrdenadosPorMedia = [...alunos].sort(
          (a, b) => (mediasAlunos[b.id] || 0) - (mediasAlunos[a.id] || 0)
        );

        // Enriquecer dados dos alunos
        const alunosEnriquecidos = alunos.map((aluno) => {
          const media = mediasAlunos[aluno.id] || 0;
          const ranking =
            alunosOrdenadosPorMedia.findIndex((a) => a.id === aluno.id) + 1;
          const totalAlunos = alunos.length;

          let corRanking = "#6c757d";
          const percentualTop = (ranking / totalAlunos) * 100;
          if (percentualTop <= 10) corRanking = "#28a745";
          else if (percentualTop <= 25) corRanking = "#20c997";
          else if (percentualTop <= 50) corRanking = "#ffc107";
          else if (percentualTop <= 75) corRanking = "#fd7e14";
          else corRanking = "#dc3545";

          return {
            ...aluno,
            media: media.toFixed(2),
            ranking,
            totalAlunos,
            corRanking,
            rankingTexto: `${ranking}º de ${totalAlunos}`,
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
