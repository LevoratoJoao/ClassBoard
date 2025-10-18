import { turma, materias } from "../data/turmas.js";

export function getAlunos() {
  return Array.isArray(turma?.alunos) ? turma.alunos : [];
}

export function getMaterias() {
  return Array.isArray(materias) ? materias : [];
}

export function getTurma() {
    return turma || {};
}

export function getMediaNotasPorMateria() {
  const alunos = getAlunos();
  const mats = getMaterias();

  return mats.map(m => {
    const notas = alunos
      .map(a => a?.notas?.[m.id])
      .filter(v => Number.isFinite(Number(v)))
      .map(Number);

    const media =
      notas.length > 0 ? notas.reduce((s, x) => s + x, 0) / notas.length : null;

    return {
      materiaId: m.id,
      materiaLabel: m.label,
      media
    };
  }).filter(row => row.media != null);
}

export function getFrequenciaMediaPorMateria() {
  const alunos = getAlunos();
  const mats = getMaterias();

  return mats.map(m => {
    const vals = alunos
      .map(a => a?.frequencia?.[m.id])
      .filter(v => Number.isFinite(Number(v)))
      .map(v => Number(v) * 100);

    const media =
      vals.length > 0 ? vals.reduce((s, x) => s + x, 0) / vals.length : null;

    return {
      materiaId: m.id,
      materiaLabel: m.label,
      frequencia: media
    };
  }).filter(row => row.frequencia != null);
}

export function getFrequenciaMediaGeral() {
  const porMateria = getFrequenciaMediaPorMateria();
  if (!porMateria.length) return null;
  const soma = porMateria.reduce((s, it) => s + it.frequencia, 0);
  return soma / porMateria.length;
}

export function getDiasComMaisFaltas(limit = 5) {
  const alunos = getAlunos();
  const mapa = new Map();

  alunos.forEach(a => {
    (a?.faltas || []).forEach(dataISO => {
      mapa.set(dataISO, (mapa.get(dataISO) || 0) + 1);
    });
  });

  const rows = Array.from(mapa.entries()).map(([data, faltas]) => ({ data, faltas }));
  rows.sort((a, b) => b.faltas - a.faltas);
  return rows.slice(0, limit);
}

export function getRelacaoEntreMaterias(threshold = 6) {
  const alunos = getAlunos();
  const mats = getMaterias();
  const out = [];

  for (let i = 0; i < mats.length; i++) {
    for (let j = i + 1; j < mats.length; j++) {
      const A = mats[i], B = mats[j];

      let goodBoth = 0, badBoth = 0, badOnlyA = 0, badOnlyB = 0, total = 0;

      alunos.forEach(a => {
        const na = num(a?.notas?.[A.id]);
        const nb = num(a?.notas?.[B.id]);
        if (na == null || nb == null) return;

        total++;
        const badA = na < threshold;
        const badB = nb < threshold;

        if (!badA && !badB) goodBoth++;
        else if (badA && badB) badBoth++;
        else if (badA && !badB) badOnlyA++;
        else if (!badA && badB) badOnlyB++;
      });

      if (total > 0) {
        out.push({
          par: `${A.label} ↔ ${B.label}`,
          bemDuas: pct(goodBoth, total),
          malDuas: pct(badBoth, total),
          malSoA: pct(badOnlyA, total),
          malSoB: pct(badOnlyB, total)
        });
      }
    }
  }
  return out;
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function pct(x, t) {
  return Math.round((x / t) * 100);
}