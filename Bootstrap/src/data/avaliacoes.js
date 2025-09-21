class Avaliacao {
  constructor(id, materia, tipo, bimestre) {
    this.id = id;
    this.materia = materia;
    this.tipo = tipo;
    this.bimestre = bimestre;
  }
}

const materias = ['Portugues', 'Matematica', 'Historia', 'Geografia', 'Ciencias', 'Artes'];
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
