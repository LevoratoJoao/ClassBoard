function setupRelatorioDownload() {
  const relBtn = document.getElementById("btn-relatorio");
  if (!relBtn) return;

  relBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const url = "/relatorio.pdf";

    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", url.split("/").pop() || "relatorio.pdf");
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

function setupUpload() {
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
    const file = input.files && input.files[0];
    if (!file) return;
    alert(`Arquivo selecionado: ${file.name}`);
  });
}

function setupRelatorioCard() {
  const card = document.querySelector("[data-download-url]");
  if (!card) return;
  card.addEventListener("click", () => {
    const url = card.getAttribute("data-download-url") || "/relatorio.pdf";
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", url.split("/").pop() || "relatorio.pdf");
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupRelatorioDownload();
  setupUpload();
  setupRelatorioCard();
});