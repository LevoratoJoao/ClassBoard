class Avaliacao {
  constructor(id, materia, aluno, nota) {
    this.id = id;
    this.materia = materia;
    this.aluno = aluno;
    this.nota = nota;
  }
}

export const avaliacoes = [
  new Avaliacao(1, 'Portugues', 'João Silva', 8.5),
  new Avaliacao(2, 'Matematica', 'Maria Oliveira', 9.0),
  new Avaliacao(3, 'Historia', 'Pedro Santos', 7.5),
  new Avaliacao(4, 'Geografia', 'Ana Costa', 8.0),
  new Avaliacao(5, 'Ciencias', 'Lucas Pereira', 9.5),
  new Avaliacao(6, 'Artes', 'Carla Rodrigues', 10.0),
  new Avaliacao(7, 'Portugues', 'Mariana Lima', 7.0),
  new Avaliacao(8, 'Matematica', 'Rafael Almeida', 6.5),
  new Avaliacao(9, 'Historia', 'Beatriz Fernandes', 8.5),
  new Avaliacao(10, 'Geografia', 'Gabriel Nunes', 9.0),
  new Avaliacao(11, 'Ciencias', 'Fernanda Gomes', 7.5),
  new Avaliacao(12, 'Artes', 'Thiago Ribeiro', 8.0),
  new Avaliacao(13, 'Portugues', 'Juliana Martins', 9.5),
  new Avaliacao(14, 'Matematica', 'Bruno Carvalho', 4.0),
  new Avaliacao(15, 'Historia', 'Aline Barros', 7.0),
  new Avaliacao(16, 'Geografia', 'Diego Moreira', 6.5),
  new Avaliacao(17, 'Ciencias', 'Patricia Dias', 8.5),
  new Avaliacao(18, 'Artes', 'Eduardo Teixeira', 9.0),
  new Avaliacao(19, 'Portugues', 'Camila Azevedo', 7.5),
  new Avaliacao(20, 'Matematica', 'Felipe Castro', 2.0),
];

export const getAvaliacoes = () => avaliacoes;

export const getAvaliacoesByMateria = materia =>
  avaliacoes.filter(avaliacao => avaliacao.materia === materia);

export const getNotasByMateria = materia => {
  return avaliacoes
    .filter(avaliacao => avaliacao.materia === materia)
    .map(avaliacao => avaliacao.nota);
};

export const getMediaByMateria = materia => {
  const notas = getNotasByMateria(materia);
  if (notas.length === 0) return 0;
  const soma = notas.reduce((acc, nota) => acc + nota, 0);
  return (soma / notas.length).toFixed(2);
};


