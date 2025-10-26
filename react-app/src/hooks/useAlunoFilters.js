import { useState, useCallback } from "react";
import { notasAPI, alunosAPI } from "../services/apiService";

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
      const aluno = alunos.find(
        (a) =>
          a.nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "") ===
          nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
      );
      return aluno?.id;
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
      return null;
    }
  }, []);

  // Função para calcular médias por matéria com filtros
  const calcularMediasPorMateria = useCallback(
    async (alunoId, materia, tipo, bimestre) => {
      try {
        // Buscar todas as notas do aluno
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

        // Calcular médias por matéria
        const materias = {};
        notasFiltradas.forEach((nota) => {
          const mat = nota.avaliacao.materia;
          if (!materias[mat]) materias[mat] = [];
          materias[mat].push(nota.nota);
        });

        const mediasMaterias = {};
        Object.entries(materias).forEach(([mat, notas]) => {
          mediasMaterias[mat] = (
            notas.reduce((a, b) => a + b, 0) / notas.length
          ).toFixed(2);
        });

        return mediasMaterias;
      } catch (error) {
        console.error("Erro ao calcular médias:", error);
        return {};
      }
    },
    []
  );

  // Função para calcular médias da turma com filtros
  const calcularMediasTurma = useCallback(async (materia, tipo, bimestre) => {
    try {
      // Buscar todas as notas da turma
      const todasNotas = await notasAPI.getAllNotas();

      // Aplicar filtros
      let notasFiltradas = todasNotas;

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

      // Calcular médias por matéria
      const materias = {};
      notasFiltradas.forEach((nota) => {
        const mat = nota.avaliacao.materia;
        if (!materias[mat]) materias[mat] = [];
        materias[mat].push(nota.nota);
      });

      const mediasTurma = {};
      Object.entries(materias).forEach(([mat, notas]) => {
        mediasTurma[mat] = (
          notas.reduce((a, b) => a + b, 0) / notas.length
        ).toFixed(2);
      });

      return mediasTurma;
    } catch (error) {
      console.error("Erro ao calcular médias da turma:", error);
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
        console.error("Erro ao processar evolução:", error);
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

        return notasFiltradas.map((nota) => nota.nota);
      } catch (error) {
        console.error("Erro ao extrair valores de notas:", error);
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
      setNotasValues
    ) => {
      setFilters(newFilters);

      try {
        // Encontrar ID do aluno
        const alunoId = await findAlunoId(alunoNome);
        if (!alunoId) {
          console.error("Aluno não encontrado");
          return;
        }

        // Aplicar filtros e calcular novos dados
        const [mediasMaterias, mediasTurma, evolucaoData, notasValues] =
          await Promise.all([
            calcularMediasPorMateria(
              alunoId,
              newFilters.materia,
              newFilters.tipo,
              newFilters.bimestre
            ),
            calcularMediasTurma(
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
          ]);

        // Atualizar estados
        setMediasMaterias(mediasMaterias);
        setMediaTurma(mediasTurma);
        setEvolucaoData(evolucaoData);
        setNotasValues(notasValues);
      } catch (error) {
        console.error("Erro ao aplicar filtros:", error);
      }
    },
    [
      alunoNome,
      findAlunoId,
      calcularMediasPorMateria,
      calcularMediasTurma,
      processarEvolucaoData,
      extrairValoresNotas,
    ]
  );

  return {
    filters,
    setFilters,
    applyFilters,
  };
};

export default useAlunoFilters;
