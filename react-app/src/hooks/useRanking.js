import { useState, useEffect, useCallback } from "react";
import { getMediaForEachAluno } from "../services/notasService";

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

  const calcularRanking = useCallback(() => {
    if (!alunoNome) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const mediasAlunos = getMediaForEachAluno();

      if (!mediasAlunos || mediasAlunos.length === 0) {
        setRanking("Dados não disponíveis");
        setLoading(false);
        return;
      }

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
        setTotalAlunos(mediasAlunos.length);
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

  const getDadosCompletos = useCallback(() => {
    const mediasAlunos = getMediaForEachAluno();
    return [...mediasAlunos].sort((a, b) => b.media - a.media);
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
