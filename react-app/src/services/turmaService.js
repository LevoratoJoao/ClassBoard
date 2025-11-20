import { turmaAPI, materiasAPI } from "./apiService";

export async function getTurma(id = 1) {
  return turmaAPI.getById(id);
}

export async function getMaterias() {
  return materiasAPI.getAll();
}

export async function getAlunos(turmaId = 1) {
  const turma = await getTurma(turmaId);
  return Array.isArray(turma?.alunos) ? turma.alunos : [];
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function pct(x, t) {
  return t > 0 ? Math.round((x / t) * 100) : 0;
}

export function getMediaNotasPorMateriaFrom(turma, materias) {
  const alunos = Array.isArray(turma?.alunos) ? turma.alunos : [];
  const mats = Array.isArray(materias) ? materias : [];

  return mats
    .map((m) => {
      const notas = alunos
        .map((a) => num(a?.notas?.[m.id]))
        .filter((v) => v != null);

      const media =
        notas.length > 0 ? notas.reduce((s, x) => s + x, 0) / notas.length : null;

      return {
        materiaId: m.id,
        materiaLabel: m.label,
        media,
      };
    })
    .filter((row) => row.media != null);
}

export function getFrequenciaMediaPorMateriaFrom(turma, materias) {
  const alunos = Array.isArray(turma?.alunos) ? turma.alunos : [];
  const mats = Array.isArray(materias) ? materias : [];

  return mats
    .map((m) => {
      const vals = alunos
        .map((a) => num(a?.frequencia?.[m.id]))
        .filter((v) => v != null)
        .map((v) => v * 100);

      const media =
        vals.length > 0 ? vals.reduce((s, x) => s + x, 0) / vals.length : null;

      return {
        materiaId: m.id,
        materiaLabel: m.label,
        frequencia: media,
      };
    })
    .filter((row) => row.frequencia != null);
}

export function getFrequenciaMediaGeralFrom(turma, materias) {
  const porMateria = getFrequenciaMediaPorMateriaFrom(turma, materias);
  if (!porMateria.length) return null;
  const soma = porMateria.reduce((s, it) => s + it.frequencia, 0);
  return soma / porMateria.length;
}

export function getDiasComMaisFaltasFrom(turma, limit = 5) {
  const alunos = Array.isArray(turma?.alunos) ? turma.alunos : [];
  const mapa = new Map();

  alunos.forEach((a) => {
    (a?.faltas || []).forEach((dataISO) => {
      mapa.set(dataISO, (mapa.get(dataISO) || 0) + 1);
    });
  });

  const rows = Array.from(mapa.entries()).map(([data, faltas]) => ({
    data,
    faltas,
  }));
  rows.sort((a, b) => b.faltas - a.faltas);
  return rows.slice(0, limit);
}

export function getRelacaoEntreMateriasFrom(turma, materias, threshold = 6) {
  const alunos = Array.isArray(turma?.alunos) ? turma.alunos : [];
  const mats = Array.isArray(materias) ? materias : [];
  const out = [];

  for (let i = 0; i < mats.length; i++) {
    for (let j = i + 1; j < mats.length; j++) {
      const A = mats[i],
        B = mats[j];

      let goodBoth = 0,
        badBoth = 0,
        badOnlyA = 0,
        badOnlyB = 0,
        total = 0;

      alunos.forEach((a) => {
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
          malSoB: pct(badOnlyB, total),
          n: total,
          A: A.id,
          B: B.id,
          labelA: A.label,
          labelB: B.label,
        });
      }
    }
  }
  return out;
}

export async function getMediaNotasPorMateria(turmaId = 1) {
  const [t, m] = await Promise.all([getTurma(turmaId), getMaterias()]);
  return getMediaNotasPorMateriaFrom(t, m);
}

export async function getFrequenciaMediaPorMateria(turmaId = 1) {
  const [t, m] = await Promise.all([getTurma(turmaId), getMaterias()]);
  return getFrequenciaMediaPorMateriaFrom(t, m);
}

export async function getFrequenciaMediaGeral(turmaId = 1) {
  const [t, m] = await Promise.all([getTurma(turmaId), getMaterias()]);
  return getFrequenciaMediaGeralFrom(t, m);
}

export async function getDiasComMaisFaltas(limit = 5, turmaId = 1) {
  const t = await getTurma(turmaId);
  return getDiasComMaisFaltasFrom(t, limit);
}

export async function getRelacaoEntreMaterias(threshold = 6, turmaId = 1) {
  const [t, m] = await Promise.all([getTurma(turmaId), getMaterias()]);
  return getRelacaoEntreMateriasFrom(t, m, threshold);
}