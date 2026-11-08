/**
 * PARCELLE (Plot)
 * Représente une parcelle de terrain cultivée
 */
export interface Parcel {
  id: string;
  nom: string;
  superficie: number; // en mètres carrés
  localisation: string;
  farmerId: string;
  cultures: string[]; // liste des cultures
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const createParcel = (data: Partial<Parcel>, farmerId: string): Parcel => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  nom: data.nom || 'Nouvelle parcelle',
  superficie: data.superficie || 0,
  localisation: data.localisation || '',
  farmerId: farmerId,
  cultures: data.cultures || [],
  description: data.description || '',
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});
