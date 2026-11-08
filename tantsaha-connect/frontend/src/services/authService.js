// src/services/authService.js
import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const authService = {
  /**
   * Initialisation de l'auth au démarrage de l'app
   * - Lit le token et l'utilisateur depuis localStorage
   * - Configure axios si token présent
   */
  async initialize() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (!token || !userStr) {
      // pas d'utilisateur connecté
      return { user: null };
    }

    try {
      const user = JSON.parse(userStr);

      // Configurer axios avec le token
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { user };
    } catch (error) {
      console.error('[authService.initialize] Erreur parsing user:', error);
      // si problème, on nettoie
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return { user: null };
    }
  },

  /**
   * Appel /api/auth/login
   * body : { email, mot_de_passe }
   */
  async login({ email, mot_de_passe }) {
    const response = await api.post('/api/auth/login', {
      email,
      mot_de_passe,
    });

    const { token, user } = response.data;

    // sauvegarde locale
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // config axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { token, user };
  },

  /**
   * Appel /api/auth/register
   * body : libre (tu peux y mettre email, mot_de_passe, nom, prenom...)
   */
  async register(data) {
    // Ton backend renvoie juste { success, message, user: req.body }
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  },
};

export default authService;