import { getNotasByMateria } from "../data/avaliacoes.js";

export const buildGraphNotasAvaliacoes = () => {
    const notas = getNotasByMateria("Matematica");
    console.log(notas);

    const data = {
        labels: [
            '< 3',
            '3-5',
            '5-8',
            '> 8',
        ],
        datasets: [{
            label: 'Medias de notas de avaliações',
            data: [
                notas.filter(nota => nota < 3).length,
                notas.filter(nota => nota >= 3 && nota < 5).length,
                notas.filter(nota => nota >= 5 && nota < 8).length,
                notas.filter(nota => nota >= 8).length
            ],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)'
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: false,
            width: 200,
            height: 200
        }
    };
    return config;
};