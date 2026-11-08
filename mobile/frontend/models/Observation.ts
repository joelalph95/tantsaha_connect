import { ReactNode } from "react";

/**
 * OBSERVATION
 * Journal d'observation des événements importants
 */
export interface Observation {
  titre: ReactNode;
  id: string;
  parcelId: string;
  description: string;
  type: 'insecte' | 'maladie' | 'climat' | 'sol' | 'autre';
  photo?: string; // chemin ou URI
  gravite: 'faible' | 'moyen' | 'grave';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export const createObservation = (data: Partial<Observation>, parcelId: string): Observation => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  parcelId: parcelId,
  description: data.description || '',
  type: data.type || 'autre',
  photo: data.photo || undefined,
  gravite: data.gravite || 'faible',
  date: data.date || new Date().toISOString().split('T')[0],
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
  titre: undefined
});
