import { useState, useCallback } from "react";
import {
  getMediaByAlunoForEachMateria,
  getMediaAvaliacaoForEachMateria,
  getMediaByAlunoForEachMateriaAndBimestre,
  getMediaByAlunoBimestreAndTipoForEachMateria,
  getMediaByAlunoBimestreForEachMateria,
  getMediaByAlunoAndTipoForEachMateria,
  getMediaByAlunoAndTipoForEachMateriaAndBimestre,
  getMediaByAlunoAndMateriaForEachBimestre,
  getMediaByAlunoTipoAndMateriaForEachBimestre,
  getMediaAvaliacaoByTipoAndBimestreForEachMateria,
  getMediaAvaliacaoByBimestreForEachMateria,
  getMediaAvaliacaoByTipoForEachMateria,
  getNotasByAlunoMateriaAndBimestre,
  getNotasByAlunoMateriaAndTipo,
  getNotasByAlunoMateriaTipoAndBimestre,
  getNotasByAlunoBimestreAndTipo,
  getNotasByAlunoAndBimestre,
  getNotasByAlunoAndTipo,
  getNotasByAlunoAndMateria,
  getMediaByMateria,
  getMediaByMateriaAndBimestre,
  getMediaByMateriaAndTipo,
  getMediaByMateriaTipoAndBimestre,
  getMediaByAlunoAndMateria,
  getMediaByAlunoMateriaAndBimestre,
  getMediaByAlunoMateriaAndTipo,
  getMediaByAlunoMateriaTipoAndBimestre,
  getMediaByAlunoMateriaAndTipoForEachBimestre,
  getNotasByAluno,
} from "../services/notasService";


export const useAlunoFilters = (alunoNome) => {
  const [filters, setFilters] = useState({
    materia: "All",
    bimestre: "All",
    tipo: "All",
  });

  const filterNotasForComparacaoTurma = useCallback(
    (materia, bimestre, tipo) => {
      let notasFiltradas = {};
      let notasTurma = {};

      const filterConfigs = [
        // Casos específicos para uma matéria selecionada
        {
          condicion: () =>
            materia !== "All" && bimestre !== "All" && tipo !== "All",
          mediaAluno: () => ({
            [materia]: getMediaByAlunoMateriaTipoAndBimestre(
              alunoNome,
              materia,
              tipo,
              Number(bimestre)
            ),
          }),
          mediaTurma: () => ({
            [materia]: getMediaByMateriaTipoAndBimestre(
              materia,
              tipo,
              Number(bimestre)
            ),
          }),
        },
        {
          condicion: () =>
            materia !== "All" && bimestre !== "All" && tipo === "All",
          mediaAluno: () => ({
            [materia]: getMediaByAlunoMateriaAndBimestre(
              alunoNome,
              materia,
              Number(bimestre)
            ),
          }),
          mediaTurma: () => ({
            [materia]: getMediaByMateriaAndBimestre(materia, Number(bimestre)),
          }),
        },
        {
          condicion: () =>
            materia !== "All" && bimestre === "All" && tipo !== "All",
          mediaAluno: () => ({
            [materia]: getMediaByAlunoMateriaAndTipo(alunoNome, materia, tipo),
          }),
          mediaTurma: () => ({
            [materia]: getMediaByMateriaAndTipo(materia, tipo),
          }),
        },
        {
          condicion: () =>
            materia !== "All" && bimestre === "All" && tipo === "All",
          mediaAluno: () => ({
            [materia]: getMediaByAlunoAndMateria(alunoNome, materia),
          }),
          mediaTurma: () => ({ [materia]: getMediaByMateria(materia) }),
        },
        // Casos para todas as matérias
        {
          condicion: () =>
            materia === "All" && bimestre !== "All" && tipo !== "All",
          mediaAluno: () =>
            getMediaByAlunoBimestreAndTipoForEachMateria(
              alunoNome,
              Number(bimestre),
              tipo
            ),
          mediaTurma: () =>
            getMediaAvaliacaoByTipoAndBimestreForEachMateria(
              tipo,
              Number(bimestre)
            ),
        },
        {
          condicion: () =>
            materia === "All" && bimestre !== "All" && tipo === "All",
          mediaAluno: () =>
            getMediaByAlunoBimestreForEachMateria(alunoNome, Number(bimestre)),
          mediaTurma: () =>
            getMediaAvaliacaoByBimestreForEachMateria(Number(bimestre)),
        },
        {
          condicion: () =>
            materia === "All" && bimestre === "All" && tipo !== "All",
          mediaAluno: () =>
            getMediaByAlunoAndTipoForEachMateria(alunoNome, tipo),
          mediaTurma: () => getMediaAvaliacaoByTipoForEachMateria(tipo),
        },
      ];

      for (const { condicion, mediaAluno, mediaTurma } of filterConfigs) {
        if (condicion()) {
          notasFiltradas = mediaAluno();
          notasTurma = mediaTurma();
          break;
        }
      }

      if (Object.keys(notasFiltradas).length === 0) {
        notasFiltradas = getMediaByAlunoForEachMateria(alunoNome);
        notasTurma = getMediaAvaliacaoForEachMateria();
      }

      return [notasFiltradas, notasTurma];
    },
    [alunoNome]
  );

  const filterNotasForEvolucaoNotas = useCallback(
    (materia, bimestre, tipo) => {
      let notasFiltradas = [];

      const filterConfigs = [
        {
          condicion: () =>
            materia !== "All" && bimestre !== "All" && tipo !== "All",
          fn: () => {
            const resultado = getMediaByAlunoMateriaAndTipoForEachBimestre(
              alunoNome,
              materia,
              tipo
            );
            return Object.keys(resultado).length > 0
              ? [
                  {
                    materia: materia,
                    notas: { [bimestre]: resultado[bimestre] || 0 },
                  },
                ]
              : [];
          },
        },
        {
          condicion: () =>
            materia !== "All" && bimestre !== "All" && tipo === "All",
          fn: () => {
            const resultado = getNotasByAlunoMateriaAndBimestre(
              alunoNome,
              materia,
              Number(bimestre)
            );
            const media =
              resultado.length > 0
                ? (
                    resultado.reduce((a, b) => a + b, 0) / resultado.length
                  ).toFixed(2)
                : 0;
            return [{ materia: materia, notas: { [bimestre]: media } }];
          },
        },
        {
          condicion: () =>
            materia !== "All" && bimestre === "All" && tipo !== "All",
          fn: () =>
            getMediaByAlunoTipoAndMateriaForEachBimestre(
              alunoNome,
              materia,
              tipo
            ),
        },
        {
          condicion: () =>
            materia !== "All" && bimestre === "All" && tipo === "All",
          fn: () =>
            getMediaByAlunoAndMateriaForEachBimestre(alunoNome, materia),
        },
        // Casos para todas as matérias
        {
          condicion: () =>
            materia === "All" && bimestre !== "All" && tipo !== "All",
          fn: () => {
            const allMaterias = [
              "Matematica",
              "Portugues",
              "Historia",
              "Geografia",
              "Ciencias",
              "Artes",
            ];
            return allMaterias
              .map((mat) => {
                const resultado = getMediaByAlunoMateriaAndTipoForEachBimestre(
                  alunoNome,
                  mat,
                  tipo
                );
                return {
                  materia: mat,
                  notas:
                    Object.keys(resultado).length > 0
                      ? { [bimestre]: resultado[bimestre] || 0 }
                      : { [bimestre]: 0 },
                };
              })
              .filter((item) => Object.values(item.notas)[0] > 0);
          },
        },
        {
          condicion: () =>
            materia === "All" && bimestre !== "All" && tipo === "All",
          fn: () => {
            const allMaterias = [
              "Matematica",
              "Portugues",
              "Historia",
              "Geografia",
              "Ciencias",
              "Artes",
            ];
            return allMaterias
              .map((mat) => {
                const notas = getNotasByAlunoMateriaAndBimestre(
                  alunoNome,
                  mat,
                  Number(bimestre)
                );
                const media =
                  notas.length > 0
                    ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(
                        2
                      )
                    : 0;
                return { materia: mat, notas: { [bimestre]: media } };
              })
              .filter((item) => Object.values(item.notas)[0] > 0);
          },
        },
        {
          condicion: () =>
            materia === "All" && bimestre === "All" && tipo !== "All",
          fn: () =>
            getMediaByAlunoAndTipoForEachMateriaAndBimestre(alunoNome, tipo),
        },
      ];

      for (const { condicion, fn } of filterConfigs) {
        if (condicion()) {
          notasFiltradas = fn();
          break;
        }
      }

      // Caso padrão (All, All, All)
      if (notasFiltradas.length === 0) {
        notasFiltradas = getMediaByAlunoForEachMateriaAndBimestre(alunoNome);
      }

      return notasFiltradas;
    },
    [alunoNome]
  );

  const filterNotasForDistribuicaoNotas = useCallback(
    (materia, bimestre, tipo) => {
      const notasAluno = getNotasByAluno(alunoNome);
      const notasValues = notasAluno?.notas
        ? notasAluno.notas.map((obj) => obj.nota)
        : [];
      let notasFiltradas = notasValues;

      const filterConfigs = [
        {
          condicion: () =>
            materia !== "All" && bimestre !== "All" && tipo !== "All",
          fn: () =>
            getNotasByAlunoMateriaTipoAndBimestre(
              alunoNome,
              materia,
              tipo,
              Number(bimestre)
            ),
        },
        {
          condicion: () =>
            materia !== "All" && bimestre !== "All" && tipo === "All",
          fn: () =>
            getNotasByAlunoMateriaAndBimestre(
              alunoNome,
              materia,
              Number(bimestre)
            ),
        },
        {
          condicion: () =>
            materia !== "All" && bimestre === "All" && tipo !== "All",
          fn: () => getNotasByAlunoMateriaAndTipo(alunoNome, materia, tipo),
        },
        {
          condicion: () =>
            materia !== "All" && bimestre === "All" && tipo === "All",
          fn: () => getNotasByAlunoAndMateria(alunoNome, materia),
        },
        {
          condicion: () =>
            materia === "All" && bimestre !== "All" && tipo !== "All",
          fn: () =>
            getNotasByAlunoBimestreAndTipo(alunoNome, Number(bimestre), tipo),
        },
        {
          condicion: () =>
            materia === "All" && bimestre !== "All" && tipo === "All",
          fn: () => getNotasByAlunoAndBimestre(alunoNome, Number(bimestre)),
        },
        {
          condicion: () =>
            materia === "All" && bimestre === "All" && tipo !== "All",
          fn: () => getNotasByAlunoAndTipo(alunoNome, tipo),
        },
      ];

      for (const { condicion, fn } of filterConfigs) {
        if (condicion()) {
          notasFiltradas = fn();
          break;
        }
      }

      return notasFiltradas;
    },
    [alunoNome]
  );

  const applyFilters = useCallback(
    (
      newFilters,
      setMediasMaterias,
      setMediaTurma,
      setEvolucaoData,
      setNotasValues
    ) => {
      setFilters(newFilters);

      const [notasFiltradas, notasTurma] = filterNotasForComparacaoTurma(
        newFilters.materia,
        newFilters.bimestre,
        newFilters.tipo
      );
      setMediasMaterias(notasFiltradas);
      setMediaTurma(notasTurma);

      const notasEvolucaoFiltradas = filterNotasForEvolucaoNotas(
        newFilters.materia,
        newFilters.bimestre,
        newFilters.tipo
      );
      setEvolucaoData(notasEvolucaoFiltradas);

      const notasDistribuicaoFiltradas = filterNotasForDistribuicaoNotas(
        newFilters.materia,
        newFilters.bimestre,
        newFilters.tipo
      );
      setNotasValues(notasDistribuicaoFiltradas);
    },
    [
      filterNotasForComparacaoTurma,
      filterNotasForEvolucaoNotas,
      filterNotasForDistribuicaoNotas,
    ]
  );

  return {
    filters,
    setFilters,
    applyFilters,
    filterNotasForComparacaoTurma,
    filterNotasForEvolucaoNotas,
    filterNotasForDistribuicaoNotas,
  };
};

export default useAlunoFilters;
