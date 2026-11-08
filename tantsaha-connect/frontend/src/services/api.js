import axios from 'axios';

// Configuration de base de l'API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter un token d'authentification si disponible
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Gestion des erreurs communes
    if (error.response?.status === 401) {
      // Rediriger vers la page de login
      window.location.href = '/login';
    }
    
    if (error.response?.status === 404) {
      console.error('Ressource non trouvée');
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout de la requête');
    }
    
    return Promise.reject(error);
  }
);

export default api;