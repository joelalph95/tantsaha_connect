export const APP_NAME = 'Tantsaha Connect';
export const APP_VERSION = '1.0.0';

// Types d'alertes
export const ALERT_TYPES = {
  PLUIE: 'pluie',
  VENT: 'vent',
  SECHERESSE: 'secheresse',
  PARASITE: 'parasite',
  MALADIE: 'maladie',
  AUTRE: 'autre'
};

// Niveaux d'urgence
export const URGENCY_LEVELS = {
  FAIBLE: 'faible',
  MOYEN: 'moyen',
  ELEVE: 'élevé'
};

// Cultures principales
export const CULTURES = [
  { id: 1, nom: 'Riz', categorie: 'rizicole' },
  { id: 2, nom: 'Manioc', categorie: 'tubercule' },
  { id: 3, nom: 'Maïs', categorie: 'céréale' },
  { id: 4, nom: 'Haricot', categorie: 'légumineuse' },
  { id: 5, nom: 'Café', categorie: 'fruit' },
  { id: 6, nom: 'Vanille', categorie: 'épice' },
  { id: 7, nom: 'Patate douce', categorie: 'tubercule' },
  { id: 8, nom: 'Arachide', categorie: 'légumineuse' },
];

// Saisons
export const SAISONS = [
  'Saison des pluies',
  'Saison sèche',
  'Transition',
  'Toute l\'année'
];

// Icônes météo
export const WEATHER_ICONS = {
  soleil: '☀️',
  nuage: '☁️',
  pluie: '🌧️',
  orage: '⛈️',
  vent: '💨',
  humidite: '💧'
};