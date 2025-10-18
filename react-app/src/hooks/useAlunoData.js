import { useState, useEffect } from "react";
import { getAlunoByName } from "../services/alunosService";
import {
  getNotasByAluno,
  getMediaByAlunoForEachMateria,
  getMediaAvaliacaoForEachMateria,
  getMediaByAlunoForEachMateriaAndBimestre,
} from "../services/notasService";
import { buildAlunoAiAnalysis } from "../services/aiService";

export const useAlunoData = (alunoNome) => {
  const [alunoData, setAlunoData] = useState(null);
  const [mediasMaterias, setMediasMaterias] = useState({});
  const [mediaTurma, setMediaTurma] = useState({});
  const [evolucaoData, setEvolucaoData] = useState([]);
  const [notasValues, setNotasValues] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [faltasTotais] = useState(Math.floor(Math.random() * 20));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!alunoNome) {
      setLoading(false);
      return;
    }

    const loadAlunoData = async () => {
      try {
        setLoading(true);
        setError(null);

        const alunoObj = getAlunoByName(alunoNome);
        setAlunoData({ nome: alunoObj || alunoNome });

        const medias = getMediaByAlunoForEachMateria(alunoNome);
        setMediasMaterias(medias);

        const mediaTurmaData = getMediaAvaliacaoForEachMateria();
        setMediaTurma(mediaTurmaData);

        const evolucaoNotasData =
          getMediaByAlunoForEachMateriaAndBimestre(alunoNome);
        setEvolucaoData(evolucaoNotasData);

        const notasAluno = getNotasByAluno(alunoNome);
        const valores = notasAluno?.notas
          ? notasAluno.notas.map((obj) => obj.nota)
          : [];
        setNotasValues(valores);

        const analysis = buildAlunoAiAnalysis(alunoNome);
        setAiAnalysis(analysis);
      } catch (err) {
        setError(err.message || "Erro ao carregar dados do aluno");
        console.error("Erro no useAlunoData:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAlunoData();
  }, [alunoNome]);

  const refetchData = () => {
    if (alunoNome) {
      const medias = getMediaByAlunoForEachMateria(alunoNome);
      setMediasMaterias(medias);

      const mediaTurmaData = getMediaAvaliacaoForEachMateria();
      setMediaTurma(mediaTurmaData);

      const evolucaoNotasData =
        getMediaByAlunoForEachMateriaAndBimestre(alunoNome);
      setEvolucaoData(evolucaoNotasData);

      const notasAluno = getNotasByAluno(alunoNome);
      const valores = notasAluno?.notas
        ? notasAluno.notas.map((obj) => obj.nota)
        : [];
      setNotasValues(valores);
    }
  };

  return {
    alunoData,
    mediasMaterias,
    mediaTurma,
    evolucaoData,
    notasValues,
    aiAnalysis,
    faltasTotais,

    loading,
    error,

    refetchData,
    setMediasMaterias,
    setMediaTurma,
    setEvolucaoData,
    setNotasValues,
  };
};

export default useAlunoData;
