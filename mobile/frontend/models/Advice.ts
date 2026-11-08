/**
 * TOROHEVITRA MOMBA NY FAMBOLENA
 * Torohevitra manokana ho an'ny fambolena
 */
export interface Advice {
  id: string;
  titre: string;
  description: string;
  culture?: string;
  categorie: 'fampitomboana_vokatra' | 'fitondran-drano' | 'bibikely_mpanimba' | 'aretina' | 'fahasalaman_ny_tany' | 'ankapobeny';
  audio?: string; // lalan'ny feo (chemin audio)
  niveau: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
}

export const createAdvice = (data: Partial<Advice>): Advice => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  titre: data.titre || 'Torohevitra vaovao',
  description: data.description || '',
  culture: data.culture || undefined,
  categorie: data.categorie || 'ankapobeny',
  audio: data.audio || undefined,
  niveau: data.niveau || 'beginner',
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

// Torohevitra efa vonona ho an'i Madagasikara
export const DEFAULT_ADVICE: Advice[] = [
  {
    id: '1',
    titre: 'Fambolena vary mandritra ny fahavaratra',
    description: 'Ny fotoam-pahavaratra (novambra ka hatramin\'ny aprily) no tena tsara amin\'ny fambolena vary. Omano dieny amin\'ny volana oktobra ny tanimbary.',
    culture: 'Vary',
    categorie: 'ankapobeny',
    niveau: 'beginner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    titre: 'Fiarovana ny mangahazo amin\'ny bibikely mpanimba',
    description: 'Zahao matetika ny fototry ny mangahazo. Mampiasà fanafody voajanahary raha mahita bibikely mpanimba ianao.',
    culture: 'Mangahazo',
    categorie: 'bibikely_mpanimba',
    niveau: 'intermediate',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    titre: 'Fitondran-drano mahomby ho an\'ny katsaka',
    description: 'Mila rano 600mm ny katsaka isaky ny fotoam-pambolena. Manondraha vao mangiran-dratsy na amin\'ny faran\'ny tolakandro.',
    culture: 'Katsaka',
    categorie: 'fitondran-drano',
    niveau: 'intermediate',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];