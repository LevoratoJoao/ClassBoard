import { avaliacoes } from "./avaliacoes.js";

export const notas = Array.from({ length: 10 }, (_, i) => ({
    aluno: `Aluno${i + 1}`,
    notas: avaliacoes.map((avaliacao, j) => ({
        avaliacao,
        nota: Math.floor(Math.random() * 11)
    }))
}));
