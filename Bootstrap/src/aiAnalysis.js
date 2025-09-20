import { getMediaByMateria, getNotasByMateria, getMediaByMateriaAndBimestre, getMediaAvaliacaoByMateriaForEachAvaliacao } from "./services/notasService.js";

export const buildMateriaAiAnalysis = (materia) => {
    const mediaGeral = getMediaByMateria(materia);
    const todasNotas = getNotasByMateria(materia);

    const mediaB1 = getMediaByMateriaAndBimestre(materia, 1);
    const mediaB2 = getMediaByMateriaAndBimestre(materia, 2);
    const mediaB3 = getMediaByMateriaAndBimestre(materia, 3);

    const mediasAvaliacoes = getMediaAvaliacaoByMateriaForEachAvaliacao(materia);

    const totalAlunos = todasNotas.length;
    const alunosAprovados = todasNotas.filter(nota => nota >= 6).length;
    const alunosReprovados = todasNotas.filter(nota => nota < 6).length;
    const percentualAprovacao = ((alunosAprovados / totalAlunos) * 100).toFixed(1);

    const bimestres = [
        { nome: '1º Bimestre', media: parseFloat(mediaB1) },
        { nome: '2º Bimestre', media: parseFloat(mediaB2) },
        { nome: '3º Bimestre', media: parseFloat(mediaB3) }
    ].filter(b => !isNaN(b.media) && b.media > 0);

    const melhorBimestre = bimestres.reduce((prev, current) =>
        prev.media > current.media ? prev : current, bimestres[0]);

    const piorBimestre = bimestres.reduce((prev, current) =>
        prev.media < current.media ? prev : current, bimestres[0]);

    const avaliacoes = Object.entries(mediasAvaliacoes);
    const melhorAvaliacao = avaliacoes.reduce((prev, current) =>
        parseFloat(prev[1]) > parseFloat(current[1]) ? prev : current, avaliacoes[0]);

    let tendencia = "estável";
    if (bimestres.length >= 2) {
        const ultimosBimestres = bimestres.slice(-2);
        const diferenca = ultimosBimestres[1].media - ultimosBimestres[0].media;
        if (diferenca > 0.5) tendencia = "crescente";
        else if (diferenca < -0.5) tendencia = "decrescente";
    }

    let comment = `Média geral: ${mediaGeral}.<br>`;
    comment += `<br>${percentualAprovacao}% dos alunos estão aprovados (${alunosAprovados}/${totalAlunos}).<br>`;

    if (bimestres.length > 0) {
        comment += `<br>Melhor desempenho: ${melhorBimestre.nome} (${melhorBimestre.media.toFixed(2)}).<br>`;
        if (bimestres.length > 1) {
            comment += `<br>Pior desempenho: ${piorBimestre.nome} (${piorBimestre.media.toFixed(2)}).<br>`;
        }
    }

    if (melhorAvaliacao) {
        comment += `<br>Melhor tipo de avaliação: ${melhorAvaliacao[0]} (${parseFloat(melhorAvaliacao[1]).toFixed(2)}).<br>`;
    }

    comment += `<br>Tendência: ${tendencia}.<br>`;

    // Performance classification
    let classificacao = "Regular";
    if (parseFloat(mediaGeral) >= 8) classificacao = "Excelente";
    else if (parseFloat(mediaGeral) >= 7) classificacao = "Bom";
    else if (parseFloat(mediaGeral) >= 6) classificacao = "Satisfatório";
    else if (parseFloat(mediaGeral) < 5) classificacao = "Necessita Atenção";

    return {
        summary: `Análise de desempenho para ${materia}: ${classificacao}.`,
        comment
    };
};