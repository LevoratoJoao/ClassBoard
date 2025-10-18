import {
  getMediaNotasPorMateria,
  getFrequenciaMediaPorMateria,
  getFrequenciaMediaGeral,
  getDiasComMaisFaltas,
  getRelacaoEntreMaterias
} from "./services/turmaService.js";

function renderMediasPorMateria() {
  const tbody = document.getElementById("tb-nota-media-por-materia");
  if (!tbody) return;

  const rows = getMediaNotasPorMateria();
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">Sem dados de notas.</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.materiaLabel}</td>
      <td class="text-end">${r.media.toFixed(1)}</td>
    </tr>`).join("");
}

function renderFrequencia() {
  const tbody = document.getElementById("tb-freq-media-por-materia");
  const geralEl = document.getElementById("freq-media-geral");
  if (!tbody) return;

  const porMateria = getFrequenciaMediaPorMateria();
  const geral = getFrequenciaMediaGeral();
  if (geralEl) geralEl.textContent = (geral != null) ? `${geral.toFixed(1)}%` : "—";

  if (!porMateria.length) {
    tbody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">Sem dados de frequência.</td></tr>`;
    return;
  }
  tbody.innerHTML = porMateria.map(r => `
    <tr>
      <td>${r.materiaLabel}</td>
      <td class="text-end">${r.frequencia.toFixed(1)}%</td>
    </tr>`).join("");
}

function renderDiasComMaisFaltas() {
  const tbody = document.getElementById("tb-dias-com-mais-faltas");
  const msg = document.getElementById("msg-sem-faltas");
  if (!tbody) return;

  const dias = getDiasComMaisFaltas(5);
  if (!dias.length) {
    if (msg) msg.classList.remove("d-none");
    tbody.innerHTML = "";
    return;
  }
  if (msg) msg.classList.add("d-none");

  tbody.innerHTML = dias.map(d => `
    <tr>
      <td>${formatDateBR(d.data)}</td>
      <td class="text-end">${d.faltas}</td>
    </tr>`).join("");
}

function renderRelacaoMaterias() {
  const tbody = document.getElementById("tb-relacao-materias");
  if (!tbody) return;

  const rel = getRelacaoEntreMaterias(6);
  if (!rel.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Sem dados suficientes.</td></tr>`;
    return;
  }
  tbody.innerHTML = rel.map(r => `
    <tr>
      <td>${r.par}</td>
      <td class="text-end">${r.bemDuas}%</td>
      <td class="text-end">${r.malDuas}%</td>
      <td class="text-end">${r.malSoA}%</td>
      <td class="text-end">${r.malSoB}%</td>
    </tr>`).join("");
}

function formatDateBR(iso) {
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("pt-BR");
}

function setupRelatorioDownloadTurma() {
  const relBtn = document.getElementById("btn-relatorio");
  if (!relBtn) return;
  relBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = "/relatorio.pdf";
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "relatorio.pdf");
    document.body.appendChild(a); a.click(); a.remove();
  });
}

function setupUploadTurma() {
  const uploadBtn = document.querySelector(".btn.btn-upload");
  if (!uploadBtn) return;
  let input = document.getElementById("file-upload-shared");
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.id = "file-upload-shared";
    input.className = "d-none";
    document.body.appendChild(input);
  }
  uploadBtn.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const f = input.files?.[0];
    if (f) alert(`Arquivo selecionado: ${f.name}`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  try { renderMediasPorMateria(); } catch (e) { console.error(e); }
  try { renderFrequencia(); } catch (e) { console.error(e); }
  try { renderDiasComMaisFaltas(); } catch (e) { console.error(e); }
  try { renderRelacaoMaterias(); } catch (e) { console.error(e); }

  setupRelatorioDownloadTurma();
  setupUploadTurma();
});
