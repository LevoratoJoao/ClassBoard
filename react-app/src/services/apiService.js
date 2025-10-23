const API_BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

export const apiService = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        return response.json();
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }
};

export const notasAPI = {
    getAllNotas: () => apiService.get('/notas'),

    filterNotas: (materia, tipo, bimestre, aluno_id) => {
        const params = new URLSearchParams();
        if (materia) params.append("materia", materia);
        if (tipo && tipo !== "All") params.append("tipo", tipo);
        if (bimestre && bimestre !== "All") params.append("bimestre", bimestre);
        if (aluno_id) params.append("aluno_id", aluno_id);

        return apiService.get(`/notas/filter?${params}`);
    },

    getNotasByAluno: (aluno_id) =>
        apiService.get(`/notas/${aluno_id}`)
};

export const avaliacoesAPI = {
    getAllAvaliacoes: () => apiService.get('/avaliacoes'),

    filterAvaliacoes: (materia, tipo, bimestre) => {
        const params = new URLSearchParams();
        if (materia) params.append("materia", materia);
        if (tipo && tipo !== "All") params.append("tipo", tipo);
        if (bimestre && bimestre !== "All") params.append("bimestre", bimestre);

        return apiService.get(`/avaliacoes/filter?${params}`);
    }
};
