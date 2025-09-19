class Avaliacao {
  constructor(id, materia, tipo, bimestre) {
    this.id = id;
    this.materia = materia;
    this.tipo = tipo;
    this.bimestre = bimestre;
  }
}

const materias = ['Português', 'Matemática', 'História', 'Geografia', 'Ciências', 'Artes'];
const tipos = ['Prova', 'Trabalho'];
const bimestres = [1, 2, 3];

export const avaliacoes = [];

let id = 1;
for (const bimestre of bimestres) {
  for (const materia of materias) {
    for (const tipo of tipos) {
      avaliacoes.push(new Avaliacao(id++, materia, tipo, bimestre));
    }
  }
}

export const getAvaliacoes = () => avaliacoes;

export const getAvaliacoesByMateria = materia =>
  avaliacoes.filter(avaliacao => avaliacao.materia === materia);

export const getAvaliacoesByBimestre = bimestre =>
  avaliacoes.filter(avaliacao => avaliacao.bimestre === bimestre);

export const getAvaliacoesByTipo = tipo =>
  avaliacoes.filter(avaliacao => avaliacao.tipo === tipo);

export const getAvaliacoesByMateriaAndBimestre = (materia, bimestre) =>
  avaliacoes.filter(avaliacao => avaliacao.materia === materia && avaliacao.bimestre === bimestre);

export const getAvaliacoesByMateriaAndTipo = (materia, tipo) =>
  avaliacoes.filter(avaliacao => avaliacao.materia === materia && avaliacao.tipo === tipo);

export const getAvaliacoesByBimestreAndTipo = (bimestre, tipo) =>
  avaliacoes.filter(avaliacao => avaliacao.bimestre === bimestre && avaliacao.tipo === tipo);

export const getAvaliacoesByMateriaTipoAndBimestre = (materia, tipo, bimestre) =>
  avaliacoes.filter(avaliacao =>
    avaliacao.materia === materia &&
    avaliacao.tipo === tipo &&
    avaliacao.bimestre === bimestre
  );