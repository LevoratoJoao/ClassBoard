import { useState, useEffect } from "react";
import { alunosAPI, notasAPI, faltasAPI } from "../services/apiService";
import { buildAlunoAiAnalysis } from "../services/aiService";

export const useAlunoData = (alunoNome) => {
  const [alunoData, setAlunoData] = useState(null);
  const [mediasMaterias, setMediasMaterias] = useState({});
  const [mediaTurma, setMediaTurma] = useState({});
  const [evolucaoData, setEvolucaoData] = useState([]);
  const [notasValues, setNotasValues] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [faltasTotais, setFaltasTotais] = useState(0);
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

        // Buscar aluno da API pelo nome
        const alunos = await alunosAPI.getAllAlunos();
        const alunoObj = alunos.find(
          (a) =>
            a.nome
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "") ===
            alunoNome
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
        );

        if (!alunoObj) {
          throw new Error("Aluno não encontrado");
        }

        setAlunoData(alunoObj);

        // Buscar notas do aluno da API
        const notasAluno = await notasAPI.getNotasByAluno(alunoObj.id);

        // Buscar todas as notas para calcular médias da turma
        const todasNotas = await notasAPI.getAllNotas();

        // Calcular médias por matéria do aluno
        const materias = {};
        notasAluno.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materias[materia]) materias[materia] = [];
          materias[materia].push(nota.nota);
        });

        const mediasAlunoMaterias = {};
        Object.entries(materias).forEach(([materia, notas]) => {
          mediasAlunoMaterias[materia] = (
            notas.reduce((a, b) => a + b, 0) / notas.length
          ).toFixed(2);
        });
        setMediasMaterias(mediasAlunoMaterias);

        // Calcular médias da turma por matéria
        const materiasTurma = {};
        todasNotas.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materiasTurma[materia]) materiasTurma[materia] = [];
          materiasTurma[materia].push(nota.nota);
        });

        const mediasTurmaMaterias = {};
        Object.entries(materiasTurma).forEach(([materia, notas]) => {
          mediasTurmaMaterias[materia] = (
            notas.reduce((a, b) => a + b, 0) / notas.length
          ).toFixed(2);
        });
        setMediaTurma(mediasTurmaMaterias);

        // Processar dados de evolução (por avaliação)
        const evolucaoNotas = {};
        notasAluno.forEach((nota) => {
          const avaliacao = nota.avaliacao.nome;
          const materia = nota.avaliacao.materia;
          if (!evolucaoNotas[avaliacao]) evolucaoNotas[avaliacao] = {};
          evolucaoNotas[avaliacao][materia] = nota.nota;
        });

        const evolucaoArray = Object.entries(evolucaoNotas).map(
          ([avaliacao, materias]) => ({
            avaliacao,
            ...materias,
          })
        );
        setEvolucaoData(evolucaoArray);

        // Extrair valores das notas
        const valores = notasAluno.map((nota) => nota.nota);
        setNotasValues(valores);

        // Buscar faltas totais da API
        try {
          const totalFaltas = await faltasAPI.getTotalFaltasByAluno(
            alunoObj.id
          );
          setFaltasTotais(totalFaltas?.total || 0);
        } catch (faltasError) {
          console.warn("Erro ao buscar faltas:", faltasError);
          setFaltasTotais(0);
        }

        // Gerar análise IA usando dados da API
        const analysis = await buildAlunoAiAnalysis(alunoObj.id);
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

  const refetchData = async () => {
    if (alunoData?.id) {
      try {
        // Recarregar dados da API
        const notasAluno = await notasAPI.getNotasByAluno(alunoData.id);
        const todasNotas = await notasAPI.getAllNotas();

        // Recalcular médias
        const materias = {};
        notasAluno.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materias[materia]) materias[materia] = [];
          materias[materia].push(nota.nota);
        });

        const mediasAlunoMaterias = {};
        Object.entries(materias).forEach(([materia, notas]) => {
          mediasAlunoMaterias[materia] = (
            notas.reduce((a, b) => a + b, 0) / notas.length
          ).toFixed(2);
        });
        setMediasMaterias(mediasAlunoMaterias);

        // Recalcular médias da turma
        const materiasTurma = {};
        todasNotas.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materiasTurma[materia]) materiasTurma[materia] = [];
          materiasTurma[materia].push(nota.nota);
        });

        const mediasTurmaMaterias = {};
        Object.entries(materiasTurma).forEach(([materia, notas]) => {
          mediasTurmaMaterias[materia] = (
            notas.reduce((a, b) => a + b, 0) / notas.length
          ).toFixed(2);
        });
        setMediaTurma(mediasTurmaMaterias);

        // Recalcular evolução
        const evolucaoNotas = {};
        notasAluno.forEach((nota) => {
          const avaliacao = nota.avaliacao.nome;
          const materia = nota.avaliacao.materia;
          if (!evolucaoNotas[avaliacao]) evolucaoNotas[avaliacao] = {};
          evolucaoNotas[avaliacao][materia] = nota.nota;
        });

        const evolucaoArray = Object.entries(evolucaoNotas).map(
          ([avaliacao, materias]) => ({
            avaliacao,
            ...materias,
          })
        );
        setEvolucaoData(evolucaoArray);

        // Recalcular valores das notas
        const valores = notasAluno.map((nota) => nota.nota);
        setNotasValues(valores);
      } catch (err) {
        console.error("Erro ao recarregar dados:", err);
      }
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
