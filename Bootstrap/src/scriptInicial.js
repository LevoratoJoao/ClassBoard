function setupRelatorioDownload() {
  const card = document.querySelector('[data-download-url]');
  if (!card) return;

  card.addEventListener('click', () => {
    const url = card.getAttribute('data-download-url') || '/relatorio.pdf';
    const a = document.createElement('a');
    a.href = url;
    const nomeArquivo = url.split('/').pop() || 'relatorio.pdf';
    a.setAttribute('download', nomeArquivo);
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupRelatorioDownload();
});