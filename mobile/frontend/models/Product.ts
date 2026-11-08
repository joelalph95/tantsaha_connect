/**
 * PRODUIT AGRICOLE
 * Produits populaires cultivés à Madagascar
 */
export type ProductCategory = 'rizicole' | 'tubercule' | 'legumineuse' | 'fruit' | 'epice' | 'legume' | 'autre';

export interface Product {
  id: string;
  nom: string;
  categorie: ProductCategory;
  description: string;
  saison_plantation?: string;
  saison_recolte?: string;
  rendement_moyen?: number; // tonnes/hectare
  createdAt: string;
  updatedAt: string;
}

export const createProduct = (data: Partial<Product>): Product => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  nom: data.nom || 'Nouveau produit',
  categorie: data.categorie || 'autre',
  description: data.description || '',
  saison_plantation: data.saison_plantation || '',
  saison_recolte: data.saison_recolte || '',
  rendement_moyen: data.rendement_moyen || 0,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

// Produits populaires malgaches par défaut
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    nom: 'Riz',
    categorie: 'rizicole',
    description: 'Culture principale de Madagascar',
    saison_plantation: 'Novembre-Décembre',
    saison_recolte: 'Mars-Avril',
    rendement_moyen: 2.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    nom: 'Manioc',
    categorie: 'tubercule',
    description: 'Culture résistante à la sécheresse',
    saison_plantation: 'Octobre-Novembre',
    saison_recolte: 'Août-Septembre',
    rendement_moyen: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    nom: 'Maïs',
    categorie: 'legumineuse',
    description: 'Céréale importante',
    saison_plantation: 'Novembre',
    saison_recolte: 'Mars-Avril',
    rendement_moyen: 1.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    nom: 'Haricot',
    categorie: 'legumineuse',
    description: 'Riche en protéines',
    saison_plantation: 'Novembre',
    saison_recolte: 'Février-Mars',
    rendement_moyen: 1.2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    nom: 'Patate douce',
    categorie: 'tubercule',
    description: 'Nutritive et productive',
    saison_plantation: 'Septembre-Octobre',
    saison_recolte: 'Février-Mars',
    rendement_moyen: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    nom: 'Arachide',
    categorie: 'legumineuse',
    description: 'Riche en huile',
    saison_plantation: 'Novembre',
    saison_recolte: 'Avril-Mai',
    rendement_moyen: 1.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    nom: 'Café',
    categorie: 'epice',
    description: 'Produit d\'exportation prestigieux',
    saison_plantation: 'Mai-Juin',
    saison_recolte: 'Septembre-Novembre',
    rendement_moyen: 0.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    nom: 'Vanille',
    categorie: 'epice',
    description: 'Or vert malgache',
    saison_plantation: 'Janvier-Mars',
    saison_recolte: 'Juin-Août',
    rendement_moyen: 0.3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
