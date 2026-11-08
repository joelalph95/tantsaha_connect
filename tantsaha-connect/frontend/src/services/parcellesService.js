import api from './api';

const parcellesService = {
  // Récupérer toutes les parcelles
  getAllParcelles: async () => {
    try {
      const response = await api.get('/parcelles');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des parcelles:', error);
      throw error;
    }
  },

  // Récupérer les parcelles d'un paysan
  getParcellesByPaysan: async (idPaysan) => {
    try {
      const response = await api.get(`/parcelles/paysan/${idPaysan}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Récupérer une parcelle par ID
  getParcelleById: async (id) => {
    try {
      const response = await api.get(`/parcelles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },

  // Créer une nouvelle parcelle
  createParcelle: async (parcelleData) => {
    try {
      const response = await api.post('/parcelles', parcelleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  },

  // Mettre à jour une parcelle
  updateParcelle: async (id, parcelleData) => {
    try {
      const response = await api.put(`/parcelles/${id}`, parcelleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  },

  // Supprimer une parcelle
  deleteParcelle: async (id) => {
    try {
      const response = await api.delete(`/parcelles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  },

  // Ajouter un produit à une parcelle
  addProduitToParcelle: async (idParcelle, idProduit, data) => {
    try {
      const response = await api.post(`/parcelles/${idParcelle}/produits/${idProduit}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  },
};

export default parcellesService;