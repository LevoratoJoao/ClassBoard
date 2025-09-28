import { turma, materias } from "./data/turmas.js";

const NOTA_BAIXA = 6.0;

const media = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

function ajustarPercentuaisQuatroCategorias(a, b, c, d) {
  const soma3 = Math.round(a) + Math.round(b) + Math.round(c);
  const ultimo = Math.max(0, 100 - soma3);
  return [Math.round(a), Math.round(b), Math.round(c), ultimo];
}

function calcularMediaNotasPorMateria() {
  const result = {};
  materias.forEach(({ id }) => {
    const notas = turma.alunos.map((a) => a.notas[id]).filter((v) => typeof v === "number");
    result[id] = media(notas);
  });
  return result;
}

function calcularFrequenciaMedia() {
  const porMateria = {};
  const todas = [];
  materias.forEach(({ id }) => {
    const arr = turma.alunos.map((a) => a.frequencia[id]).filter((v) => typeof v === "number");
    porMateria[id] = media(arr);
    todas.push(...arr);
  });
  return { porMateria, geral: media(todas) };
}

function calcularDiasComMaisFaltas() {
  const count = new Map();
  turma.alunos.forEach((a) => (a.faltas || []).forEach((d) => count.set(d, (count.get(d) || 0) + 1)));
  return Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function calcularRelacaoMateriasIntuitiva() {
  const out = [];
  for (let i = 0; i < materias.length; i++) {
    for (let j = i + 1; j < materias.length; j++) {
      const A = materias[i].id;
      const B = materias[j].id;
      const labelA = materias[i].label;
      const labelB = materias[j].label;

      let n = 0;
      let bothGood = 0;
      let bothBad = 0;
      let onlyABad = 0;
      let onlyBBad = 0;

      turma.alunos.forEach((al) => {
        const na = al.notas[A];
        const nb = al.notas[B];
        if (typeof na !== "number" || typeof nb !== "number") return;

        n++;
        const aBad = na < NOTA_BAIXA;
        const bBad = nb < NOTA_BAIXA;

        if (!aBad && !bBad) bothGood++;
        else if (aBad && bBad) bothBad++;
        else if (aBad && !bBad) onlyABad++;
        else if (!aBad && bBad) onlyBBad++;
      });

      const denom = n || 1;
      const pBothGood = (bothGood / denom) * 100;
      const pBothBad = (bothBad / denom) * 100;
      const pOnlyABad = (onlyABad / denom) * 100;
      const pOnlyBBad = (onlyBBad / denom) * 100;

      const [PBG, PBB, POA, POB] = ajustarPercentuaisQuatroCategorias(
        pBothGood,
        pBothBad,
        pOnlyABad,
        pOnlyBBad
      );

      out.push({ A, B, labelA, labelB, n, PBG, PBB, POA, POB });
    }
  }
  return out;
}

function renderPagina() {
  document.getElementById("turma-title").textContent = turma.nome;

  const notas = calcularMediaNotasPorMateria();
  const tbNotas = document.getElementById("tb-nota-media-por-materia");
  tbNotas.innerHTML = materias.map(({ id, label }) =>
    `<tr><td>${label}</td><td class="text-end">${(notas[id] ?? 0).toFixed(2)}</td></tr>`
  ).join("");

  const { porMateria, geral } = calcularFrequenciaMedia();
  document.getElementById("freq-media-geral").textContent = `${(geral * 100).toFixed(1)}%`;
  const tbFreq = document.getElementById("tb-freq-media-por-materia");
  tbFreq.innerHTML = materias.map(({ id, label }) =>
    `<tr><td>${label}</td><td class="text-end">${((porMateria[id] ?? 0) * 100).toFixed(1)}%</td></tr>`
  ).join("");

  const dias = calcularDiasComMaisFaltas();
  const tbDias = document.getElementById("tb-dias-com-mais-faltas");
  const msgSemFaltas = document.getElementById("msg-sem-faltas");
  if (!dias.length) {
    tbDias.innerHTML = "";
    msgSemFaltas.style.display = "inline";
  } else {
    msgSemFaltas.style.display = "none";
    tbDias.innerHTML = dias.map(([data, qtd]) =>
      `<tr><td>${data}</td><td class="text-end">${qtd}</td></tr>`
    ).join("");
  }

  const rel = calcularRelacaoMateriasIntuitiva();
  const tbRel = document.getElementById("tb-relacao-materias");
  tbRel.innerHTML = rel.map(({ labelA, labelB, n, PBG, PBB, POA, POB }) => `
    <tr>
      <td>${labelA} ↔ ${labelB} <small class="text-muted">(${n} alunos)</small></td>
      <td class="text-end">${PBG}%</td>
      <td class="text-end">${PBB}%</td>
      <td className="text-end">${POA}% <small class="text-muted">(só ${labelA})</small></td>
      <td className="text-end">${POB}% <small class="text-muted">(só ${labelB})</small></td>
    </tr>
  `).join("");

  const btnRel = document.getElementById("btn-relatorio");
  if (btnRel) btnRel.addEventListener("click", () => alert("Aqui acionaria o download do relatório."));
}

document.addEventListener("DOMContentLoaded", renderPagina);