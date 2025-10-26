import { useState, useEffect, useCallback } from "react";
import { alunosAPI, notasAPI } from "../services/apiService";

export const useRanking = (alunoNome) => {
  const [ranking, setRanking] = useState("");
  const [posicao, setPosicao] = useState(null);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [percentil, setPercentil] = useState(null);
  const [mediaAluno, setMediaAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalize = useCallback((str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();
  }, []);

  const calcularRanking = useCallback(async () => {
    if (!alunoNome) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Buscar alunos e notas da API
      const alunos = await alunosAPI.getAllAlunos();
      const todasNotas = await notasAPI.getAllNotas();

      if (!alunos || alunos.length === 0) {
        setRanking("Dados não disponíveis");
        setLoading(false);
        return;
      }

      // Calcular médias por aluno usando dados da API
      const mediasAlunos = alunos.map((aluno) => {
        const notasAluno = todasNotas.filter(
          (nota) => nota.aluno_id === aluno.id
        );
        const media =
          notasAluno.length > 0
            ? notasAluno.reduce((sum, nota) => sum + nota.nota, 0) /
              notasAluno.length
            : 0;
        return {
          aluno: aluno.nome,
          media: media,
          id: aluno.id,
        };
      });

      // Ordenar por média
      const alunosOrdenados = [...mediasAlunos].sort(
        (a, b) => b.media - a.media
      );

      const nomeAtual = normalize(alunoNome);
      const posicaoIndex = alunosOrdenados.findIndex(
        (aluno) => normalize(aluno.aluno) === nomeAtual
      );

      if (posicaoIndex >= 0) {
        const posicaoAtual = posicaoIndex + 1;
        const total = alunosOrdenados.length;
        const mediaDoAluno = alunosOrdenados[posicaoIndex].media;

        const percentilCalculado = Math.round(
          ((total - posicaoAtual) / total) * 100
        );

        setPosicao(posicaoAtual);
        setTotalAlunos(total);
        setPercentil(percentilCalculado);
        setMediaAluno(mediaDoAluno);
        setRanking(`${posicaoAtual}º de ${total}`);
      } else {
        setRanking("Aluno não encontrado");
        setPosicao(null);
        setTotalAlunos(alunos.length);
        setPercentil(null);
        setMediaAluno(null);
      }
    } catch (error) {
      console.error("Erro ao calcular ranking:", error);
      setRanking("Erro ao calcular ranking");
    } finally {
      setLoading(false);
    }
  }, [alunoNome, normalize]);

  useEffect(() => {
    calcularRanking();
  }, [calcularRanking]);

  const getDadosCompletos = useCallback(async () => {
    try {
      const alunos = await alunosAPI.getAllAlunos();
      const todasNotas = await notasAPI.getAllNotas();

      const mediasAlunos = alunos.map((aluno) => {
        const notasAluno = todasNotas.filter(
          (nota) => nota.aluno_id === aluno.id
        );
        const media =
          notasAluno.length > 0
            ? notasAluno.reduce((sum, nota) => sum + nota.nota, 0) /
              notasAluno.length
            : 0;
        return {
          aluno: aluno.nome,
          media: media,
          id: aluno.id,
        };
      });

      return [...mediasAlunos].sort((a, b) => b.media - a.media);
    } catch (error) {
      console.error("Erro ao buscar dados completos:", error);
      return [];
    }
  }, []);

  return {
    ranking,
    posicao,
    totalAlunos,
    percentil,
    mediaAluno,
    loading,
    calcularRanking,
    getDadosCompletos,
    rankingFormatado: ranking,
  };
};

export default useRanking;
