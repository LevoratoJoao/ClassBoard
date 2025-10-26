const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiService = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                ...getAuthHeaders(),
            },
        });

        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            return;
        }

        return response.json();
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(),
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
            return;
        }

        return response.json();
    }
};

export const notasAPI = {
  getAllNotas: () => apiService.get("/notas"),

  filterNotas: (materia, tipo, bimestre, aluno_id) => {
    const params = new URLSearchParams();
    if (materia) params.append("materia", materia);
    if (tipo && tipo !== "All") params.append("tipo", tipo);
    if (bimestre && bimestre !== "All") params.append("bimestre", bimestre);
    if (aluno_id) params.append("aluno_id", aluno_id);

    return apiService.get(`/notas/filter?${params}`);
  },

  getNotasByAluno: (aluno_id) => apiService.get(`/notas/${aluno_id}`),
};

export const avaliacoesAPI = {
  getAllAvaliacoes: () => apiService.get("/avaliacoes"),

  filterAvaliacoes: (materia, tipo, bimestre) => {
    const params = new URLSearchParams();
    if (materia) params.append("materia", materia);
    if (tipo && tipo !== "All") params.append("tipo", tipo);
    if (bimestre && bimestre !== "All") params.append("bimestre", bimestre);

    return apiService.get(`/avaliacoes/filter?${params}`);
  },
};

export const alunosAPI = {
  getAllAlunos: () => apiService.get("/alunos"),

  getAlunoById: (aluno_id) => apiService.get(`/alunos/${aluno_id}`),

  filterAlunos: (sexo) => {
    const params = new URLSearchParams();
    if (sexo && sexo !== "All") params.append("sexo", sexo);

    return apiService.get(`/alunos/filter?${params}`);
  },
};

export const faltasAPI = {
  getAllFaltas: () => apiService.get("/faltas"),

  getFaltasByAluno: (aluno_id) => apiService.get(`/faltas/${aluno_id}`),

  getTotalFaltasByAluno: (aluno_id) =>
    apiService.get(`/faltas/${aluno_id}/total`),
};
