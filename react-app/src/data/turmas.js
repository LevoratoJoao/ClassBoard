export const materias = [
  { id: "Matematica", label: "Matemática" },
  { id: "Ciencias", label: "Ciências" },
  { id: "Portugues", label: "Português" },
  { id: "Historia", label: "História" },
  { id: "Geografia", label: "Geografia" },
  { id: "Artes", label: "Artes" },
];

export const turma = {
  id: 1,
  nome: "5º Ano - Fundamental I",
  turno: "Manhã",
  alunos: [
    {
      id: "a1",
      nome: "Ana",
      notas: { Matematica: 7.2, Ciencias: 6.8, Portugues: 8.1, Historia: 7.5, Geografia: 7.0, Artes: 9.0 },
      frequencia: { Matematica: 0.92, Ciencias: 0.90, Portugues: 0.95, Historia: 0.93, Geografia: 0.94, Artes: 0.96 },
      faltas: ["2025-08-22", "2025-08-29"]
    },
    {
      id: "a2",
      nome: "Bruno",
      notas: { Matematica: 5.8, Ciencias: 5.9, Portugues: 7.2, Historia: 6.5, Geografia: 6.8, Artes: 7.9 },
      frequencia: { Matematica: 0.88, Ciencias: 0.86, Portugues: 0.92, Historia: 0.90, Geografia: 0.91, Artes: 0.94 },
      faltas: ["2025-08-22", "2025-08-27", "2025-09-03"]
    },
    {
      id: "a3",
      nome: "Carlos",
      notas: { Matematica: 8.4, Ciencias: 8.1, Portugues: 6.9, Historia: 7.2, Geografia: 7.0, Artes: 6.8 },
      frequencia: { Matematica: 0.95, Ciencias: 0.94, Portugues: 0.90, Historia: 0.92, Geografia: 0.93, Artes: 0.90 },
      faltas: ["2025-09-03"]
    },
    {
      id: "a4",
      nome: "Daniela",
      notas: { Matematica: 9.1, Ciencias: 9.0, Portugues: 8.8, Historia: 8.0, Geografia: 8.2, Artes: 9.5 },
      frequencia: { Matematica: 0.98, Ciencias: 0.97, Portugues: 0.96, Historia: 0.95, Geografia: 0.97, Artes: 0.99 },
      faltas: []
    },
    {
      id: "a5",
      nome: "Eduardo",
      notas: { Matematica: 6.2, Ciencias: 6.5, Portugues: 6.9, Historia: 6.0, Geografia: 6.1, Artes: 7.0 },
      frequencia: { Matematica: 0.90, Ciencias: 0.89, Portugues: 0.91, Historia: 0.88, Geografia: 0.90, Artes: 0.92 },
      faltas: ["2025-08-29", "2025-09-10"]
    },
    {
      id: "a6",
      nome: "Fernanda",
      notas: { Matematica: 4.9, Ciencias: 5.1, Portugues: 7.0, Historia: 6.8, Geografia: 6.4, Artes: 7.3 },
      frequencia: { Matematica: 0.85, Ciencias: 0.86, Portugues: 0.90, Historia: 0.91, Geografia: 0.89, Artes: 0.93 },
      faltas: ["2025-08-22", "2025-09-10", "2025-09-10"]
    },
    {
      id: "a7",
      nome: "Gabriel",
      notas: { Matematica: 7.6, Ciencias: 7.4, Portugues: 6.2, Historia: 6.5, Geografia: 6.8, Artes: 8.1 },
      frequencia: { Matematica: 0.93, Ciencias: 0.92, Portugues: 0.90, Historia: 0.89, Geografia: 0.92, Artes: 0.95 },
      faltas: ["2025-08-27"]
    },
    {
      id: "a8",
      nome: "Helena",
      notas: { Matematica: 9.0, Ciencias: 8.8, Portugues: 9.2, Historia: 8.5, Geografia: 8.6, Artes: 9.4 },
      frequencia: { Matematica: 0.99, Ciencias: 0.98, Portugues: 0.97, Historia: 0.96, Geografia: 0.97, Artes: 0.99 },
      faltas: []
    },
  ]
};