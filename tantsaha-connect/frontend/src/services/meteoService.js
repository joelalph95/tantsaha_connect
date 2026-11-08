import api from './api';

const meteoService = {
  // Récupérer la météo du jour
  getMeteoToday: async (idPaysan) => {
    try {
      const response = await api.get(`/meteo/today/${idPaysan}`);
      return response.data;
    } catch (error) {
      console.error('Erreur météo:', error);
      // Retourner des données par défaut
      return {
        temperature: 25,
        humidite: 70,
        pluie: 'Faible',
        vent: '10 km/h',
        date_meteo: new Date().toISOString().split('T')[0]
      };
    }
  },

  // Récupérer les prévisions
  getForecast: async (idPaysan) => {
    try {
      const response = await api.get(`/meteo/forecast/${idPaysan}`);
      return response.data;
    } catch (error) {
      console.error('Erreur prévisions:', error);
      return [];
    }
  },

  // Récupérer l'historique
  getHistory: async (idPaysan, startDate, endDate) => {
    try {
      const response = await api.get(`/meteo/history/${idPaysan}`, {
        params: { start: startDate, end: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur historique:', error);
      return [];
    }
  },

  // Enregistrer des données météo
  saveMeteoData: async (meteoData) => {
    try {
      const response = await api.post('/meteo', meteoData);
      return response.data;
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      throw error;
    }
  },
};

export default meteoService;