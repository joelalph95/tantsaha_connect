/**
 * METEO LOCALE
 * Données météorologiques pour le paysan
 */
export interface WeatherData {
  id: string;
  farmerId: string;
  date: string;
  temperature: number; // en Celsius
  humidite: number; // 0-100%
  pluie: number; // en mm
  vent: number; // en km/h
  condition: 'ensoleille' | 'nuageux' | 'pluvieux' | 'orageux';
  uvIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export const createWeatherData = (data: Partial<WeatherData>, farmerId: string): WeatherData => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  farmerId: farmerId,
  date: data.date || new Date().toISOString().split('T')[0],
  temperature: data.temperature || 24,
  humidite: data.humidite || 65,
  pluie: data.pluie || 0,
  vent: data.vent || 5,
  condition: data.condition || 'nuageux',
  uvIndex: data.uvIndex || 5,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

// Données météo par défaut pour Madagascar
export const DEFAULT_WEATHER: WeatherData = {
  id: '1',
  farmerId: 'default',
  date: new Date().toISOString().split('T')[0],
  temperature: 24,
  humidite: 65,
  pluie: 0,
  vent: 8,
  condition: 'nuageux',
  uvIndex: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
