const API_BASE_URL = 'http://localhost:8000';

export const authService = {
    login: async (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/token`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        return data;
    },

    logout: async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        }
        localStorage.removeItem('access_token');
    },

    getCurrentUser: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return null;

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            localStorage.removeItem('access_token');
            return null;
        }

        return response.json();
    },

    getToken: () => localStorage.getItem('access_token'),

    isAuthenticated: () => !!localStorage.getItem('access_token'),
};
