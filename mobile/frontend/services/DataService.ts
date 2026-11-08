/**
 * DATA SERVICE
 * Gestion centrale des données via API Backend + AsyncStorage (cache local)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Farmer, createFarmer } from '../models/Farmer';
import { Parcel, createParcel } from '../models/Parcel';
import { Observation, createObservation } from '../models/Observation';
import { Advice, DEFAULT_ADVICE } from '../models/Advice';
import { Alert, DEFAULT_ALERTS } from '../models/Alert';
import { WeatherData, DEFAULT_WEATHER } from '../models/Weather';
import { Product, DEFAULT_PRODUCTS } from '../models/Product';
import { AppParameters, DEFAULT_PARAMETERS } from '../models/Parameters';
import { apiCall } from './ApiConfig';

const STORAGE_KEYS = {
  FARMER: 'farmer_data',
  FARMER_ID: 'farmer_id',
  PARCELS: 'parcels_data',
  OBSERVATIONS: 'observations_data',
  ADVICE: 'advice_data',
  ALERTS: 'alerts_data',
  WEATHER: 'weather_data',
  PRODUCTS: 'products_data',
  PARAMETERS: 'parameters_data',
};

/**
 * Helper pour normaliser les IDs (MongoDB utilise _id, on convertit en id)
 */
function normalizeId(data: any): any {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => normalizeId(item));
  }
  if (typeof data === 'object' && data._id && !data.id) {
    return { ...data, id: data._id };
  }
  return data;
}
async function saveObservation(obs: Observation) {
  // ... sauvegarde dans AsyncStorage ou API
}

/**
 * Obtenir l'ID d'un objet (peut être _id ou id)
 */
function getId(obj: any): string | undefined {
  return obj?.id || obj?._id;
}

export class DataService {
  static resetAll() {
      throw new Error('Method not implemented.');
  }
  static resel: any;
  // ====== FARMER ======
  static async getFarmer(): Promise<Farmer | null> {
    try {
      // Chercher le fermier en cache d'abord
      const cachedFarmer = await AsyncStorage.getItem(STORAGE_KEYS.FARMER);
      if (cachedFarmer) {
        return JSON.parse(cachedFarmer);
      }

      // Sinon, essayer de récupérer du backend
      const farmerId = await AsyncStorage.getItem(STORAGE_KEYS.FARMER_ID);
      if (farmerId) {
        try {
          const farmer = await apiCall(`/farmers/${farmerId}`);
          await AsyncStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
          return farmer;
        } catch (error) {
          console.warn('Could not fetch farmer from backend, using cache');
          return cachedFarmer ? JSON.parse(cachedFarmer) : null;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting farmer:', error);
      return null;
    }
  }

  static async createFarmerProfile(name: string, phone: string): Promise<Farmer> {
    try {
      // Créer sur le backend
      const farmer = await apiCall('/farmers', {
        method: 'POST',
        body: JSON.stringify({ nom: name, telephone: phone }),
      });

      // Sauvegarder en cache et stocker l'ID
      await AsyncStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
      await AsyncStorage.setItem(STORAGE_KEYS.FARMER_ID, farmer._id);

      return farmer;
    } catch (error) {
      console.error('Error creating farmer:', error);
      // Fallback: créer localement
      const farmer = createFarmer({ nom: name, telephone: phone });
      await AsyncStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
      throw error;
    }
  }

  // ====== PARCELS ======
  static async getParcels(): Promise<Parcel[]> {
    try {
      const farmer = await this.getFarmer();
      if (!farmer) return [];

      // Récupérer du backend
      try {
        const parcels = await apiCall(`/parcels/farmer/${farmer.id}`);
        await AsyncStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(parcels));
        return parcels;
      } catch (error) {
        console.warn('Could not fetch parcels from backend, using cache');
        // Fallback au cache local
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.PARCELS);
        return cached ? JSON.parse(cached) : [];
      }
    } catch (error) {
      console.error('Error getting parcels:', error);
      return [];
    }
  }

  static async addParcel(nom: string, superficie: number, localisation: string, cultures: string[]): Promise<Parcel> {
    const farmer = await this.getFarmer();
    if (!farmer) throw new Error('No farmer profile');

    try {
      // Créer sur le backend
      const parcel = await apiCall('/parcels', {
        method: 'POST',
        body: JSON.stringify({
          farmerId: farmer.id,
          nom,
          surface: superficie,
          location: { latitude: 0, longitude: 0 },
          cultures,
          etat: 'preparation',
        }),
      });

      // Mettre à jour le cache
      const parcels = await this.getParcels();
      parcels.push(parcel);
      await AsyncStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(parcels));

      return parcel;
    } catch (error) {
      console.error('Error adding parcel:', error);
      throw error;
    }
  }

  static async updateParcel(id: string, updates: Partial<Parcel>): Promise<Parcel | null> {
    try {
      const parcel = await apiCall(`/parcels/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      // Mettre à jour le cache
      const parcels = await this.getParcels();
      const index = parcels.findIndex(p => p.id === id);
      if (index !== -1) {
        parcels[index] = parcel;
        await AsyncStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(parcels));
      }

      return parcel;
    } catch (error) {
      console.error('Error updating parcel:', error);
      throw error;
    }
  }

  static async deleteParcel(id: string): Promise<boolean> {
    try {
      await apiCall(`/parcels/${id}`, { method: 'DELETE' });

      // Mettre à jour le cache
      const parcels = await this.getParcels();
      const filtered = parcels.filter(p => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(filtered));

      return true;
    } catch (error) {
      console.error('Error deleting parcel:', error);
      throw error;
    }
  }

  // ====== OBSERVATIONS ======
  static async getObservations(): Promise<Observation[]> {
    try {
      const farmer = await this.getFarmer();
      if (!farmer) return [];

      try {
        const observations = await apiCall(`/observations/farmer/${farmer.id}`);
        await AsyncStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(observations));
        return observations;
      } catch (error) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
        return cached ? JSON.parse(cached) : [];
      }
    } catch (error) {
      console.error('Error getting observations:', error);
      return [];
    }
  }

  static async getObservationsByParcel(parcelId: string): Promise<Observation[]> {
    const observations = await this.getObservations();
    return observations.filter(o => o.parcelId === parcelId || o.parcelId === parcelId);
  }

  static async addObservation(
    parcelId: string,
    description: string,
    type: 'insecte' | 'maladie' | 'climat' | 'sol' | 'autre',
    gravite: 'faible' | 'moyen' | 'grave'
  ): Promise<Observation> {
    const farmer = await this.getFarmer();
    if (!farmer) throw new Error('No farmer profile');

    try {
      const observation = await apiCall('/observations', {
        method: 'POST',
        body: JSON.stringify({
          farmerId: farmer.id,
          parcelId,
          type,
          description,
          severite: gravite,
          images: [],
          actionsPrises: [],
        }),
      });

      const observations = await this.getObservations();
      observations.push(observation);
      await AsyncStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(observations));

      return observation;
    } catch (error) {
      console.error('Error adding observation:', error);
      throw error;
    }
  }

  static async updateObservation(id: string, updates: Partial<Observation>): Promise<Observation | null> {
    try {
      const observation = await apiCall(`/observations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      // Mettre à jour le cache
      const observations = await this.getObservations();
      const index = observations.findIndex(o => o.id === id);
      if (index !== -1) {
        observations[index] = observation;
        await AsyncStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(observations));
      }

      return observation;
    } catch (error) {
      console.error('Error updating observation:', error);
      throw error;
    }
  }

  static async deleteObservation(id: string): Promise<boolean> {
    try {
      await apiCall(`/observations/${id}`, { method: 'DELETE' });

      const observations = await this.getObservations();
      const filtered = observations.filter(o => o.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(filtered));

      return true;
    } catch (error) {
      console.error('Error deleting observation:', error);
      throw error;
    }
  }

  // ====== ALERTS ======
  static async getAlerts(): Promise<Alert[]> {
    try {
      const farmer = await this.getFarmer();
      if (!farmer) return DEFAULT_ALERTS;

      try {
        const alerts = await apiCall(`/alerts/farmer/${farmer.id}`);
        await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
        return alerts;
      } catch (error) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.ALERTS);
        return cached ? JSON.parse(cached) : DEFAULT_ALERTS;
      }
    } catch (error) {
      console.error('Error getting alerts:', error);
      return DEFAULT_ALERTS;
    }
  }

  static async initializeAlerts(): Promise<void> {
    const alerts = await this.getAlerts();
    if (alerts.length === 0) {
      await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(DEFAULT_ALERTS));
    }
  }

  static async markAlertAsRead(id: string): Promise<void> {
    try {
      await apiCall(`/alerts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ lu: true }),
      });

      const alerts = await this.getAlerts();
      const index = alerts.findIndex(a => a.id === id);
      if (index !== -1) {
        alerts[index].valide = false;
        await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  }

  // ====== ADVICE ======
  static async getAdvice(): Promise<Advice[]> {
    try {
      const farmer = await this.getFarmer();
      if (!farmer) return DEFAULT_ADVICE;

      try {
        const advice = await apiCall(`/advice/farmer/${farmer.id}`);
        await AsyncStorage.setItem(STORAGE_KEYS.ADVICE, JSON.stringify(advice));
        return advice;
      } catch (error) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.ADVICE);
        return cached ? JSON.parse(cached) : DEFAULT_ADVICE;
      }
    } catch (error) {
      console.error('Error getting advice:', error);
      return DEFAULT_ADVICE;
    }
  }

  static async initializeAdvice(): Promise<void> {
    const advice = await this.getAdvice();
    if (advice.length === 0) {
      await AsyncStorage.setItem(STORAGE_KEYS.ADVICE, JSON.stringify(DEFAULT_ADVICE));
    }
  }

  // ====== WEATHER ======
  static async getWeather(): Promise<WeatherData> {
    try {
      const farmer = await this.getFarmer();
      if (!farmer) return DEFAULT_WEATHER;

      try {
        const weather = await apiCall(`/weather/farmer/${farmer.id}`);
        await AsyncStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(weather));
        return weather;
      } catch (error) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.WEATHER);
        return cached ? JSON.parse(cached) : DEFAULT_WEATHER;
      }
    } catch (error) {
      console.error('Error getting weather:', error);
      return DEFAULT_WEATHER;
    }
  }

  static async updateWeather(updates: Partial<WeatherData>): Promise<WeatherData> {
    const farmer = await this.getFarmer();
    if (!farmer) throw new Error('No farmer profile');

    try {
      await apiCall('/weather', {
        method: 'POST',
        body: JSON.stringify({
          farmerId: farmer.id,
          ...updates,
        }),
      });

      const weather = { ...DEFAULT_WEATHER, ...updates, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(weather));
      return weather;
    } catch (error) {
      console.error('Error updating weather:', error);
      return DEFAULT_WEATHER;
    }
  }

  // ====== PRODUCTS ======
  static async getProducts(): Promise<Product[]> {
    try {
      const farmer = await this.getFarmer();
      if (!farmer) return DEFAULT_PRODUCTS;

      try {
        const products = await apiCall(`/products/farmer/${farmer.id}`);
        await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return products;
      } catch (error) {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
        return cached ? JSON.parse(cached) : DEFAULT_PRODUCTS;
      }
    } catch (error) {
      console.error('Error getting products:', error);
      return DEFAULT_PRODUCTS;
    }
  }

  static async initializeProducts(): Promise<void> {
    const products = await this.getProducts();
    if (products.length === 0) {
      await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
  }

  // ====== PARAMETERS ======
  static async getParameters(): Promise<AppParameters> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PARAMETERS);
      return data ? JSON.parse(data) : DEFAULT_PARAMETERS;
    } catch (error) {
      console.error('Error getting parameters:', error);
      return DEFAULT_PARAMETERS;
    }
  }

  static async updateParameters(updates: Partial<AppParameters>): Promise<AppParameters> {
    const current = await this.getParameters();
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await AsyncStorage.setItem(STORAGE_KEYS.PARAMETERS, JSON.stringify(updated));
    return updated;
  }

  // ====== UTILITY ======
  static async initializeAll(): Promise<void> {
    await this.initializeAlerts();
    await this.initializeAdvice();
    await this.initializeProducts();
  }

  static async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await apiCall('/health');
      return !!response;
    } catch (error) {
      console.warn('Health check failed:', error);
      return false;
    }
  }
}
