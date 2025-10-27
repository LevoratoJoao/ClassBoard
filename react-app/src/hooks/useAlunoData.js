import { useState, useEffect } from "react";
import {
  alunosAPI,
  notasAPI,
  faltasAPI,
  avaliacoesAPI,
} from "../services/apiService";

// Função para calcular médias por bimestre
const calcularMediasPorBimestre = async (notasAluno, todasAvaliacoes) => {
  try {
    // Criar mapa de notas existentes
    const notasMap = {};
    notasAluno.forEach((nota) => {
      notasMap[nota.avaliacao.id] = nota.nota;
    });

    // Estrutura: { materia: { bimestre1: media, bimestre2: media, ... } }
    const mediasPorMateriaBimestre = {};

    // Agrupar avaliações por matéria e bimestre
    todasAvaliacoes.forEach((avaliacao) => {
      const materiaKey = avaliacao.materia;
      const bimestreKey = `bimestre${avaliacao.bimestre}`;

      if (!mediasPorMateriaBimestre[materiaKey]) {
        mediasPorMateriaBimestre[materiaKey] = {};
      }

      if (!mediasPorMateriaBimestre[materiaKey][bimestreKey]) {
        mediasPorMateriaBimestre[materiaKey][bimestreKey] = {
          somaNotas: 0,
          totalAvaliacoes: 0,
        };
      }

      // Usar nota existente ou 0 se não foi feita
      const nota = notasMap[avaliacao.id] || 0;
      mediasPorMateriaBimestre[materiaKey][bimestreKey].somaNotas += nota;
      mediasPorMateriaBimestre[materiaKey][bimestreKey].totalAvaliacoes += 1;
    });

    // Calcular médias finais
    const resultado = {};
    Object.keys(mediasPorMateriaBimestre).forEach((materia) => {
      resultado[materia] = {};
      Object.keys(mediasPorMateriaBimestre[materia]).forEach((bimestre) => {
        const dados = mediasPorMateriaBimestre[materia][bimestre];
        if (dados.totalAvaliacoes > 0) {
          resultado[materia][bimestre] = (
            dados.somaNotas / dados.totalAvaliacoes
          ).toFixed(2);
        } else {
          resultado[materia][bimestre] = "N/A";
        }
      });
    });

    return resultado;
  } catch (error) {
    console.error("Erro ao calcular médias por bimestre:", error);
    return {};
  }
};

// Função helper para calcular média correta considerando todas as avaliações obrigatórias
const calcularMediaCorretaAlunoData = async (
  notasAluno,
  todasAvaliacoes,
  alunoId
) => {
  try {
    // Criar mapa de notas existentes
    const notasMap = {};
    notasAluno.forEach((nota) => {
      notasMap[nota.avaliacao.id] = nota.nota;
    });

    // Agrupar por matéria e calcular médias
    const mediasPorMateria = {};

    todasAvaliacoes.forEach((avaliacao) => {
      const materiaKey = avaliacao.materia;

      if (!mediasPorMateria[materiaKey]) {
        mediasPorMateria[materiaKey] = { somaNotas: 0, totalAvaliacoes: 0 };
      }

      // Usar nota existente ou 0 se não foi feita
      const nota = notasMap[avaliacao.id] || 0;
      mediasPorMateria[materiaKey].somaNotas += nota;
      mediasPorMateria[materiaKey].totalAvaliacoes += 1;
    });

    // Calcular médias finais
    const resultado = {};
    Object.keys(mediasPorMateria).forEach((mat) => {
      const dados = mediasPorMateria[mat];
      if (dados.totalAvaliacoes > 0) {
        resultado[mat] = (dados.somaNotas / dados.totalAvaliacoes).toFixed(2);
      } else {
        resultado[mat] = "0.00";
      }
    });

    return resultado;
  } catch (error) {
    console.error("Erro ao calcular média correta:", error);
    return {};
  }
};

// Função para calcular evolução correta por bimestre
const calcularEvolucaoCorreta = (notasAluno, todasAvaliacoes) => {
  try {
    // Criar mapa de notas existentes
    const notasMap = {};
    notasAluno.forEach((nota) => {
      notasMap[nota.avaliacao.id] = nota.nota;
    });

    // Agrupar por matéria e bimestre
    const materiaEvolucao = {};

    todasAvaliacoes.forEach((avaliacao) => {
      const materia = avaliacao.materia;
      const bimestre = avaliacao.bimestre;

      if (!materiaEvolucao[materia]) {
        materiaEvolucao[materia] = { materia, notas: {} };
      }

      if (!materiaEvolucao[materia].notas[bimestre]) {
        materiaEvolucao[materia].notas[bimestre] = {
          somaNotas: 0,
          totalAvaliacoes: 0,
        };
      }

      // Usar nota existente ou 0 se não foi feita
      const nota = notasMap[avaliacao.id] || 0;
      materiaEvolucao[materia].notas[bimestre].somaNotas += nota;
      materiaEvolucao[materia].notas[bimestre].totalAvaliacoes += 1;
    });

    // Calcular média por bimestre
    Object.values(materiaEvolucao).forEach((materia) => {
      Object.keys(materia.notas).forEach((bimestre) => {
        const dados = materia.notas[bimestre];
        if (dados.totalAvaliacoes > 0) {
          materia.notas[bimestre] = dados.somaNotas / dados.totalAvaliacoes;
        } else {
          materia.notas[bimestre] = 0;
        }
      });
    });

    return Object.values(materiaEvolucao);
  } catch (error) {
    console.error("Erro ao calcular evolução correta:", error);
    return [];
  }
};

// Função alternativa mais simples para calcular médias da turma
const calcularMediaTurmaSimples = async (todasNotas, todosAlunos) => {
  try {
    console.log("calcularMediaTurmaSimples - Iniciando cálculo");

    const materias = [
      "Matematica",
      "Portugues",
      "Historia",
      "Geografia",
      "Ciencias",
      "Artes",
    ];
    const mediasTurma = {};

    materias.forEach((materia) => {
      // Filtrar todas as notas da matéria
      const notasMateria = todasNotas.filter(
        (nota) => nota.avaliacao && nota.avaliacao.materia === materia
      );

      if (notasMateria.length > 0) {
        // Agrupar por aluno e calcular média individual
        const mediasPorAluno = {};
        notasMateria.forEach((nota) => {
          if (!mediasPorAluno[nota.aluno_id]) {
            mediasPorAluno[nota.aluno_id] = { soma: 0, count: 0 };
          }
          mediasPorAluno[nota.aluno_id].soma += nota.nota;
          mediasPorAluno[nota.aluno_id].count += 1;
        });

        // Calcular média de cada aluno na matéria
        const mediasAlunosMateria = Object.values(mediasPorAluno).map(
          (dados) => dados.soma / dados.count
        );

        // Calcular média geral da turma na matéria
        if (mediasAlunosMateria.length > 0) {
          const mediaTurmaMateria =
            mediasAlunosMateria.reduce((a, b) => a + b, 0) /
            mediasAlunosMateria.length;
          mediasTurma[materia] = mediaTurmaMateria.toFixed(2);
          console.log(
            `${materia}: Média da turma = ${mediaTurmaMateria.toFixed(
              2
            )} (baseada em ${mediasAlunosMateria.length} alunos)`
          );
        } else {
          mediasTurma[materia] = "0.00";
        }
      } else {
        mediasTurma[materia] = "0.00";
        console.log(`${materia}: Nenhuma nota encontrada`);
      }
    });

    console.log("Médias da turma (método simples):", mediasTurma);
    return mediasTurma;
  } catch (error) {
    console.error("Erro ao calcular média da turma (método simples):", error);
    return {};
  }
};
const calcularMediaCorretaTurma = async (
  todasNotas,
  todasAvaliacoes,
  todosAlunos
) => {
  try {
    console.log("calcularMediaCorretaTurma - Iniciando cálculo");
    console.log("Total de notas:", todasNotas.length);
    console.log("Total de avaliações:", todasAvaliacoes.length);
    console.log("Total de alunos:", todosAlunos.length);

    const mediasAlunosPorMateria = {};

    // Para cada aluno, calcular sua média correta (aguardando cada cálculo)
    for (const aluno of todosAlunos) {
      const notasAluno = todasNotas.filter(
        (nota) => nota.aluno_id === aluno.id
      );

      // Aguardar o cálculo da média do aluno
      const mediasAluno = await calcularMediaCorretaAlunoData(
        notasAluno,
        todasAvaliacoes,
        aluno.id
      );

      console.log(`Médias do aluno ${aluno.nome}:`, mediasAluno);

      // Adicionar às médias da turma
      Object.keys(mediasAluno).forEach((mat) => {
        const media = parseFloat(mediasAluno[mat]);
        if (!isNaN(media) && media > 0) {
          // Só considera médias válidas e maiores que 0
          if (!mediasAlunosPorMateria[mat]) {
            mediasAlunosPorMateria[mat] = [];
          }
          mediasAlunosPorMateria[mat].push(media);
        }
      });
    }

    console.log("Médias por matéria coletadas:", mediasAlunosPorMateria);

    // Calcular média final da turma por matéria
    const mediasTurma = {};
    Object.keys(mediasAlunosPorMateria).forEach((mat) => {
      const medias = mediasAlunosPorMateria[mat];
      if (medias.length > 0) {
        const mediaFinal = (
          medias.reduce((a, b) => a + b, 0) / medias.length
        ).toFixed(2);
        mediasTurma[mat] = mediaFinal;
        console.log(
          `Média da turma em ${mat}: ${mediaFinal} (baseada em ${medias.length} alunos)`
        );
      } else {
        mediasTurma[mat] = "0.00";
        console.log(`Nenhuma média válida encontrada para ${mat}`);
      }
    });

    console.log("Médias finais da turma:", mediasTurma);
    return mediasTurma;
  } catch (error) {
    console.error("Erro ao calcular média correta da turma:", error);
    return {};
  }
};

export const useAlunoData = (alunoNome) => {
  const [alunoData, setAlunoData] = useState(null);
  const [mediasMaterias, setMediasMaterias] = useState({});
  const [mediasPorBimestre, setMediasPorBimestre] = useState({});
  const [mediaTurma, setMediaTurma] = useState({});
  const [evolucaoData, setEvolucaoData] = useState([]);
  const [notasValues, setNotasValues] = useState([]);
  const [notasDetalhadas, setNotasDetalhadas] = useState([]);
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

        // Buscar dados necessários
        const notasAluno = await notasAPI.getNotasByAluno(alunoObj.id);
        const todasNotas = await notasAPI.getAllNotas();
        const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();
        const todosAlunos = await alunosAPI.getAllAlunos();

        // Calcular médias corretas do aluno usando a função helper
        const mediasAlunoMaterias = await calcularMediaCorretaAlunoData(
          notasAluno,
          todasAvaliacoes,
          alunoObj.id
        );
        setMediasMaterias(mediasAlunoMaterias);

        // Calcular médias por bimestre
        const mediasBimestre = await calcularMediasPorBimestre(
          notasAluno,
          todasAvaliacoes
        );
        setMediasPorBimestre(mediasBimestre);

        // Calcular médias corretas da turma usando método simples
        const mediasTurmaMaterias = await calcularMediaTurmaSimples(
          todasNotas,
          todosAlunos
        );
        setMediaTurma(mediasTurmaMaterias);

        // Processar dados de evolução usando função correta
        const evolucaoArray = calcularEvolucaoCorreta(
          notasAluno,
          todasAvaliacoes
        );
        setEvolucaoData(evolucaoArray);

        // Extrair valores das notas
        const valores = notasAluno.map((nota) => nota.nota);
        setNotasValues(valores);

        // Extrair notas detalhadas para o gráfico individual
        const detalhadas = notasAluno.map((nota) => ({
          materia: nota.avaliacao.materia,
          nota: nota.nota,
          tipo: nota.avaliacao.tipo,
          bimestre: nota.avaliacao.bimestre,
          avaliacao: `${nota.avaliacao.tipo} ${nota.avaliacao.bimestre}º Bim`,
        }));
        setNotasDetalhadas(detalhadas);

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
        const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();
        const todosAlunos = await alunosAPI.getAllAlunos();

        // Recalcular médias corretas do aluno
        const mediasAlunoMaterias = await calcularMediaCorretaAlunoData(
          notasAluno,
          todasAvaliacoes,
          alunoData.id
        );
        setMediasMaterias(mediasAlunoMaterias);

        // Recalcular médias da turma usando método simples
        const mediasTurmaMaterias = await calcularMediaTurmaSimples(
          todasNotas,
          todosAlunos
        );
        setMediaTurma(mediasTurmaMaterias);

        // Recalcular evolução usando função correta
        const evolucaoArray = calcularEvolucaoCorreta(
          notasAluno,
          todasAvaliacoes
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
    mediasPorBimestre,
    mediaTurma,
    evolucaoData,
    notasValues,
    notasDetalhadas,
    faltasTotais,

    loading,
    error,

    refetchData,
    setMediasMaterias,
    setMediaTurma,
    setEvolucaoData,
    setNotasValues,
    setNotasDetalhadas,
    setMediasPorBimestre,
  };
};

export default useAlunoData;
