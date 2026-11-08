/**
 * PAYSAN (Farmer)
 * Entité représentant l'utilisateur paysan
 */
export interface Farmer {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export const createFarmer = (data: Partial<Farmer>): Farmer => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  nom: data.nom || '',
  prenom: data.prenom || '',
  telephone: data.telephone || '',
  region: data.region || '',
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});
