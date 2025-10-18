import turma from "../assets/images/criancas.jpg";
import relatorio from "../assets/images/relatorio.webp";
import aluna from "../assets/images/dedicada.webp";
import materia from "../assets/images/geo.webp";
import tempo from "../assets/images/hist.webp";
import dispositivo from "../assets/images/dispositivo.png";
import lei from "../assets/images/lei.webp";
import dados from "../assets/images/grafico.webp";

export const carouselCards = [
  {
    id: 1,
    image: tempo,
    title: "Economize de Tempo",
  },
  {
    id: 2,
    image: dispositivo,
    title: "Multiplataforma",
    style: { width: "220px", objectFit: "contain" },
  },
  {
    id: 3,
    image: relatorio,
    title: "Exporte relatórios",
  },
  {
    id: 4,
    image: aluna,
    title: "Analise por aluno",
  },
  {
    id: 5,
    image: materia,
    title: "Analise por matéria",
  },
  {
    id: 6,
    image: turma,
    title: "Analise por turma",
  },
  {
    id: 7,
    image: lei,
    title: "Concordância com a LGPD",
  },
  {
    id: 8,
    image: dados,
    title: "Uploado simples de dados",
  },
];
