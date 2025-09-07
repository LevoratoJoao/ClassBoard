const params = new URLSearchParams(window.location.search);
const materia = params.get('materia');

const detalhes = {
    'Portugues': 'Detalhes sobre a matéria de Português.',
    'Matematica': 'Detalhes sobre a matéria de Matemática.',
    'Historia': 'Detalhes sobre a matéria de História.',
    'Geografia': 'Detalhes sobre a matéria de Geografia.',
    'Ciencias': 'Detalhes sobre a matéria de Ciências.',
    'Artes': 'Detalhes sobre a matéria de Artes.',
};

document.getElementById('materia-title').textContent = materia || 'Matéria não encontrada';
document.getElementById('materia-details').textContent = detalhes[materia] || 'Nenhum detalhe disponível.';
