import { useState, useEffect } from "react";
import { alunosAPI, notasAPI, faltasAPI } from "../services/apiService";

export const useAlunoData = (alunoNome) => {
  const [alunoData, setAlunoData] = useState(null);
  const [mediasMaterias, setMediasMaterias] = useState({});
  const [mediaTurma, setMediaTurma] = useState({});
  const [evolucaoData, setEvolucaoData] = useState([]);
  const [notasValues, setNotasValues] = useState([]);
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

        // Obter todas as matérias existentes na base de dados
        const todasMaterias = [
          ...new Set(todasNotas.map((nota) => nota.avaliacao.materia)),
        ];

        // Calcular médias por matéria do aluno
        const materias = {};
        notasAluno.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materias[materia]) materias[materia] = [];
          materias[materia].push(nota.nota);
        });

        // Incluir TODAS as matérias, mesmo aquelas sem notas para o aluno
        const mediasAlunoMaterias = {};
        todasMaterias.forEach((materia) => {
          if (materias[materia]) {
            // Aluno tem notas nesta matéria
            mediasAlunoMaterias[materia] = (
              materias[materia].reduce((a, b) => a + b, 0) /
              materias[materia].length
            ).toFixed(2);
          } else {
            // Aluno não tem notas nesta matéria
            mediasAlunoMaterias[materia] = "0.00";
          }
        });
        setMediasMaterias(mediasAlunoMaterias);

        // Calcular médias da turma por matéria (para TODAS as matérias)
        const materiasTurma = {};
        todasNotas.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materiasTurma[materia]) materiasTurma[materia] = [];
          materiasTurma[materia].push(nota.nota);
        });

        const mediasTurmaMaterias = {};
        todasMaterias.forEach((materia) => {
          if (materiasTurma[materia]) {
            mediasTurmaMaterias[materia] = (
              materiasTurma[materia].reduce((a, b) => a + b, 0) /
              materiasTurma[materia].length
            ).toFixed(2);
          } else {
            mediasTurmaMaterias[materia] = "0.00";
          }
        });
        setMediaTurma(mediasTurmaMaterias);

        // Processar dados de evolução (por matéria ao longo do tempo)
        const materiaEvolucao = {};
        notasAluno.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          const bimestre = nota.avaliacao.bimestre;

          if (!materiaEvolucao[materia]) {
            materiaEvolucao[materia] = { materia, notas: {} };
          }

          // Acumular notas por bimestre
          if (!materiaEvolucao[materia].notas[bimestre]) {
            materiaEvolucao[materia].notas[bimestre] = [];
          }
          materiaEvolucao[materia].notas[bimestre].push(nota.nota);
        });

        // Calcular média por bimestre
        Object.values(materiaEvolucao).forEach((materia) => {
          Object.keys(materia.notas).forEach((bimestre) => {
            const notas = materia.notas[bimestre];
            materia.notas[bimestre] =
              notas.reduce((a, b) => a + b, 0) / notas.length;
          });
        });

        const evolucaoArray = Object.values(materiaEvolucao);
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

        // Análise da IA agora é carregada separadamente na página
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

        // Obter todas as matérias existentes
        const todasMaterias = [
          ...new Set(todasNotas.map((nota) => nota.avaliacao.materia)),
        ];

        // Recalcular médias
        const materias = {};
        notasAluno.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materias[materia]) materias[materia] = [];
          materias[materia].push(nota.nota);
        });

        // Incluir TODAS as matérias
        const mediasAlunoMaterias = {};
        todasMaterias.forEach((materia) => {
          if (materias[materia]) {
            mediasAlunoMaterias[materia] = (
              materias[materia].reduce((a, b) => a + b, 0) /
              materias[materia].length
            ).toFixed(2);
          } else {
            mediasAlunoMaterias[materia] = "0.00";
          }
        });
        setMediasMaterias(mediasAlunoMaterias);

        // Recalcular médias da turma (para TODAS as matérias)
        const materiasTurma = {};
        todasNotas.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          if (!materiasTurma[materia]) materiasTurma[materia] = [];
          materiasTurma[materia].push(nota.nota);
        });

        const mediasTurmaMaterias = {};
        todasMaterias.forEach((materia) => {
          if (materiasTurma[materia]) {
            mediasTurmaMaterias[materia] = (
              materiasTurma[materia].reduce((a, b) => a + b, 0) /
              materiasTurma[materia].length
            ).toFixed(2);
          } else {
            mediasTurmaMaterias[materia] = "0.00";
          }
        });
        setMediaTurma(mediasTurmaMaterias);

        // Recalcular evolução
        const materiaEvolucao = {};
        notasAluno.forEach((nota) => {
          const materia = nota.avaliacao.materia;
          const bimestre = nota.avaliacao.bimestre;

          if (!materiaEvolucao[materia]) {
            materiaEvolucao[materia] = { materia, notas: {} };
          }

          // Acumular notas por bimestre
          if (!materiaEvolucao[materia].notas[bimestre]) {
            materiaEvolucao[materia].notas[bimestre] = [];
          }
          materiaEvolucao[materia].notas[bimestre].push(nota.nota);
        });

        // Calcular média por bimestre
        Object.values(materiaEvolucao).forEach((materia) => {
          Object.keys(materia.notas).forEach((bimestre) => {
            const notas = materia.notas[bimestre];
            materia.notas[bimestre] =
              notas.reduce((a, b) => a + b, 0) / notas.length;
          });
        });

        const evolucaoArray = Object.values(materiaEvolucao);
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
