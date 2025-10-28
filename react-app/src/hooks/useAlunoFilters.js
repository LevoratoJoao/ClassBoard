import { useState, useCallback } from "react";
import { notasAPI, alunosAPI, avaliacoesAPI } from "../services/apiService";

// Função helper para calcular média correta considerando todas as avaliações obrigatórias
const calcularMediaCorreta = async (
  notasAluno,
  materia = null,
  bimestre = null,
  tipo = null
) => {
  try {
    // Buscar todas as avaliações do sistema
    const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();

    // Filtrar avaliações baseado nos critérios
    let avaliacoesFiltradas = todasAvaliacoes;

    if (materia && materia !== "All") {
      avaliacoesFiltradas = avaliacoesFiltradas.filter(
        (av) => av.materia === materia
      );
    }

    if (bimestre && bimestre !== "All") {
      const bimestreNum = parseInt(bimestre);
      avaliacoesFiltradas = avaliacoesFiltradas.filter(
        (av) => av.bimestre === bimestreNum
      );
    }

    if (tipo && tipo !== "All") {
      avaliacoesFiltradas = avaliacoesFiltradas.filter(
        (av) => av.tipo === tipo
      );
    }

    // Se não há avaliações após filtros, retornar objeto vazio ou valores padrão
    if (avaliacoesFiltradas.length === 0) {
      // Se foi aplicado um filtro específico de matéria, retornar essa matéria com 0
      if (materia && materia !== "All") {
        return { [materia]: "0.00" };
      }

      // Senão, retornar todas as matérias que o aluno tem notas
      const materiasDoAluno = [
        ...new Set(
          notasAluno
            .filter((nota) => nota.avaliacao && nota.avaliacao.materia)
            .map((nota) => nota.avaliacao.materia)
        ),
      ];

      const resultado = {};
      materiasDoAluno.forEach((mat) => {
        resultado[mat] = "0.00";
      });

      return resultado;
    }

    // Criar mapa de notas existentes
    const notasMap = {};
    notasAluno.forEach((nota) => {
      if (nota.avaliacao && nota.avaliacao.id) {
        notasMap[nota.avaliacao.id] = nota.nota;
      }
    });

    // Agrupar por matéria e calcular médias
    const mediasPorMateria = {};

    avaliacoesFiltradas.forEach((avaliacao) => {
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
        const media = (dados.somaNotas / dados.totalAvaliacoes).toFixed(2);
        resultado[mat] = media;
      } else {
        resultado[mat] = "0.00";
      }
    });

    return resultado;
  } catch (error) {
    return {};
  }
};

export const useAlunoFilters = (alunoNome) => {
  const [filters, setFilters] = useState({
    materia: "All",
    bimestre: "All",
    tipo: "All",
  });

  // Função para encontrar ID do aluno pelo nome
  const findAlunoId = useCallback(async (nome) => {
    try {
      const alunos = await alunosAPI.getAllAlunos();

      // Função para normalizar nomes (remover acentos e converter para minúsculo)
      const normalizarNome = (str) => {
        return str
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos (acentos)
          .trim();
      };

      const nomeBuscaNormalizado = normalizarNome(nome);

      const aluno = alunos.find((a) => {
        const nomeAlunoNormalizado = normalizarNome(a.nome);
        return nomeAlunoNormalizado === nomeBuscaNormalizado;
      });

      return aluno?.id;
    } catch (error) {
      return null;
    }
  }, []);

  // Função para calcular médias por matéria com filtros
  const calcularMediasPorMateria = useCallback(
    async (alunoId, materia, tipo, bimestre) => {
      try {
        // Buscar todas as notas do aluno
        const notasAluno = await notasAPI.getNotasByAluno(alunoId);

        if (notasAluno.length === 0) {
          return {};
        }

        // Usar a função helper para cálculo correto
        const resultado = await calcularMediaCorreta(
          notasAluno,
          materia,
          bimestre,
          tipo
        );
        return resultado;
      } catch (error) {
        return {};
      }
    },
    []
  );

  // Função para calcular médias por bimestre com filtros
  const calcularMediasPorBimestre = useCallback(
    async (alunoId, materia, tipo, bimestre) => {
      try {
        // Buscar todas as notas do aluno
        const notasAluno = await notasAPI.getNotasByAluno(alunoId);
        const todasAvaliacoes = await avaliacoesAPI.getAllAvaliacoes();

        // Filtrar avaliações baseado nos critérios
        let avaliacoesFiltradas = todasAvaliacoes;

        if (materia && materia !== "All") {
          avaliacoesFiltradas = avaliacoesFiltradas.filter(
            (av) => av.materia === materia
          );
        }

        if (bimestre && bimestre !== "All") {
          const bimestreNum = parseInt(bimestre);
          avaliacoesFiltradas = avaliacoesFiltradas.filter(
            (av) => av.bimestre === bimestreNum
          );
        }

        if (tipo && tipo !== "All") {
          avaliacoesFiltradas = avaliacoesFiltradas.filter(
            (av) => av.tipo === tipo
          );
        }

        // Criar mapa de notas existentes
        const notasMap = {};
        notasAluno.forEach((nota) => {
          notasMap[nota.avaliacao.id] = nota.nota;
        });

        // Estrutura: { materia: { bimestre1: media, bimestre2: media, ... } }
        const mediasPorMateriaBimestre = {};

        // Agrupar avaliações filtradas por matéria e bimestre
        avaliacoesFiltradas.forEach((avaliacao) => {
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
          mediasPorMateriaBimestre[materiaKey][
            bimestreKey
          ].totalAvaliacoes += 1;
        });

        // Calcular médias finais
        const resultado = {};
        Object.keys(mediasPorMateriaBimestre).forEach((mat) => {
          resultado[mat] = {};
          Object.keys(mediasPorMateriaBimestre[mat]).forEach((bim) => {
            const dados = mediasPorMateriaBimestre[mat][bim];
            if (dados.totalAvaliacoes > 0) {
              resultado[mat][bim] = (
                dados.somaNotas / dados.totalAvaliacoes
              ).toFixed(2);
            } else {
              resultado[mat][bim] = "N/A";
            }
          });
        });

        return resultado;
      } catch (error) {
        return {};
      }
    },
    []
  );

  // Função para calcular médias da turma com filtros (versão corrigida)
  const calcularMediasTurma = useCallback(async (materia, tipo, bimestre) => {
    try {
      // Buscar todas as notas da turma
      const todasNotas = await notasAPI.getAllNotas();
      const todosAlunos = await alunosAPI.getAllAlunos();

      // IMPORTANTE: Calcular médias da turma para TODAS as matérias,
      // não apenas as filtradas. O filtro é aplicado ao aluno,
      // mas a comparação deve ser com a turma completa

      const mediasTurmaFinal = {};

      // Primeiro, vamos calcular média da turma SEM filtros para todas as matérias
      for (const aluno of todosAlunos) {
        const notasAluno = todasNotas.filter(
          (nota) => nota.aluno_id === aluno.id
        );
        const mediasAluno = await calcularMediaCorreta(
          notasAluno,
          null,
          null,
          null
        ); // SEM filtros

        // Adicionar às médias da turma
        Object.keys(mediasAluno).forEach((mat) => {
          if (mediasAluno[mat] !== "N/A" && mediasAluno[mat] !== "0.00") {
            if (!mediasTurmaFinal[mat]) {
              mediasTurmaFinal[mat] = [];
            }
            const media = parseFloat(mediasAluno[mat]);
            if (!isNaN(media) && media > 0) {
              mediasTurmaFinal[mat].push(media);
            }
          }
        });
      }

      // Calcular média final da turma por matéria
      const resultadoFinal = {};
      Object.keys(mediasTurmaFinal).forEach((mat) => {
        const medias = mediasTurmaFinal[mat];
        if (medias && medias.length > 0) {
          const mediaFinal = (
            medias.reduce((a, b) => a + b, 0) / medias.length
          ).toFixed(2);
          resultadoFinal[mat] = mediaFinal;
        }
      });

      return resultadoFinal;
    } catch (error) {
      return {};
    }
  }, []);

  // Função para processar dados de evolução com filtros
  const processarEvolucaoData = useCallback(
    async (alunoId, materia, tipo, bimestre) => {
      try {
        const notasAluno = await notasAPI.getNotasByAluno(alunoId);

        // Aplicar filtros
        let notasFiltradas = notasAluno;

        if (materia && materia !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.materia === materia
          );
        }

        if (tipo && tipo !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.tipo === tipo
          );
        }

        if (bimestre && bimestre !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.bimestre === parseInt(bimestre)
          );
        }

        // Processar evolução por matéria e bimestre
        const materiaEvolucao = {};
        notasFiltradas.forEach((nota) => {
          const mat = nota.avaliacao.materia;
          const bim = nota.avaliacao.bimestre;

          if (!materiaEvolucao[mat]) {
            materiaEvolucao[mat] = { materia: mat, notas: {} };
          }

          if (!materiaEvolucao[mat].notas[bim]) {
            materiaEvolucao[mat].notas[bim] = [];
          }
          materiaEvolucao[mat].notas[bim].push(nota.nota);
        });

        // Calcular média por bimestre
        Object.values(materiaEvolucao).forEach((materia) => {
          Object.keys(materia.notas).forEach((bim) => {
            const notas = materia.notas[bim];
            materia.notas[bim] =
              notas.reduce((a, b) => a + b, 0) / notas.length;
          });
        });

        return Object.values(materiaEvolucao);
      } catch (error) {
        return [];
      }
    },
    []
  );

  // Função para extrair notas detalhadas com informações completas
  const extrairNotasDetalhadas = useCallback(
    async (alunoId, materia, tipo, bimestre) => {
      try {
        const notasAluno = await notasAPI.getNotasByAluno(alunoId);

        // Aplicar filtros
        let notasFiltradas = notasAluno;

        if (materia && materia !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.materia === materia
          );
        }

        if (tipo && tipo !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.tipo === tipo
          );
        }

        if (bimestre && bimestre !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.bimestre === parseInt(bimestre)
          );
        }

        // Retornar dados detalhados para o gráfico
        return notasFiltradas.map((nota) => ({
          materia: nota.avaliacao.materia,
          nota: nota.nota,
          tipo: nota.avaliacao.tipo,
          bimestre: nota.avaliacao.bimestre,
          avaliacao: `${nota.avaliacao.tipo} ${nota.avaliacao.bimestre}º Bim`,
        }));
      } catch (error) {
        return [];
      }
    },
    []
  );

  // Função para extrair valores das notas com filtros
  const extrairValoresNotas = useCallback(
    async (alunoId, materia, tipo, bimestre) => {
      try {
        const notasAluno = await notasAPI.getNotasByAluno(alunoId);

        // Aplicar filtros
        let notasFiltradas = notasAluno;

        if (materia && materia !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.materia === materia
          );
        }

        if (tipo && tipo !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.tipo === tipo
          );
        }

        if (bimestre && bimestre !== "All") {
          notasFiltradas = notasFiltradas.filter(
            (nota) => nota.avaliacao.bimestre === parseInt(bimestre)
          );
        }

        // OPÇÃO 1: Retornar notas individuais (comportamento atual)
        // return notasFiltradas.map((nota) => nota.nota);

        // OPÇÃO 2: Retornar médias por matéria para consistência
        // Calcular médias por matéria das notas filtradas
        const materias = {};
        notasFiltradas.forEach((nota) => {
          const mat = nota.avaliacao.materia;
          if (!materias[mat]) materias[mat] = [];
          materias[mat].push(nota.nota);
        });

        // Converter para array de médias
        const mediasPorMateria = Object.keys(materias).map((mat) => {
          const notasMateria = materias[mat];
          return notasMateria.reduce((a, b) => a + b, 0) / notasMateria.length;
        });

        return mediasPorMateria.length > 0
          ? mediasPorMateria
          : notasFiltradas.map((nota) => nota.nota);
      } catch (error) {
        return [];
      }
    },
    []
  );

  const applyFilters = useCallback(
    async (
      newFilters,
      setMediasMaterias,
      setMediaTurma,
      setEvolucaoData,
      setNotasValues,
      setNotasDetalhadas,
      setMediasPorBimestre
    ) => {
      setFilters(newFilters);

      try {
        // Encontrar ID do aluno
        const alunoId = await findAlunoId(alunoNome);
        if (alunoId === null || alunoId === undefined) {
          return;
        }

        // IMPORTANTE: Sempre calcular médias da turma SEM filtros para comparação
        const mediasTurmaCompletas = await calcularMediasTurma(
          null,
          null,
          null
        );

        // Aplicar filtros apenas aos dados do aluno
        const [
          mediasMaterias,
          evolucaoData,
          notasValues,
          notasDetalhadas,
          mediasBimestre,
        ] = await Promise.all([
          calcularMediasPorMateria(
            alunoId,
            newFilters.materia,
            newFilters.tipo,
            newFilters.bimestre
          ),
          processarEvolucaoData(
            alunoId,
            newFilters.materia,
            newFilters.tipo,
            newFilters.bimestre
          ),
          extrairValoresNotas(
            alunoId,
            newFilters.materia,
            newFilters.tipo,
            newFilters.bimestre
          ),
          extrairNotasDetalhadas(
            alunoId,
            newFilters.materia,
            newFilters.tipo,
            newFilters.bimestre
          ),
          calcularMediasPorBimestre(
            alunoId,
            newFilters.materia,
            newFilters.tipo,
            newFilters.bimestre
          ),
        ]);

        // Atualizar estados
        setMediasMaterias(mediasMaterias);
        setMediaTurma(mediasTurmaCompletas); // SEMPRE usar médias completas da turma
        setEvolucaoData(evolucaoData);
        setNotasValues(notasValues);
        if (setNotasDetalhadas) {
          setNotasDetalhadas(notasDetalhadas);
        }
        if (setMediasPorBimestre) {
          setMediasPorBimestre(mediasBimestre);
        }
      } catch (error) {
        // Erro silencioso
      }
    },
    [
      alunoNome,
      findAlunoId,
      calcularMediasPorMateria,
      calcularMediasPorBimestre,
      calcularMediasTurma,
      processarEvolucaoData,
      extrairValoresNotas,
      extrairNotasDetalhadas,
    ]
  );

  return {
    filters,
    setFilters,
    calcularMediasPorMateria,
    calcularMediasPorBimestre,
    calcularMediasTurma,
    processarEvolucaoData,
    extrairValoresNotas,
    extrairNotasDetalhadas,
    applyFilters,
  };
};

export default useAlunoFilters;
