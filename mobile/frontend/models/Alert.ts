/**
 * FILAZANA LOZA ARA-PAMBOLENA
 * Fampandrenesana manan-danja ho an'ny tantsaha
 */
export type AlertSeverity = 'info' | 'warning' | 'danger' | 'critical';

export interface Alert {
  id: string;
  titre: string;
  description: string;
  type: 'meteo' | 'parasite' | 'maladie' | 'prix' | 'calendrier' | 'general';
  severite: AlertSeverity;
  date: string;
  valide: boolean;
  createdAt: string;
  updatedAt: string;
}

export const createAlert = (data: Partial<Alert>): Alert => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  titre: data.titre || 'Fampandrenesana vaovao',
  description: data.description || '',
  type: data.type || 'general',
  severite: data.severite || 'info',
  date: data.date || new Date().toISOString().split('T')[0],
  valide: data.valide !== undefined ? data.valide : true,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

// Fampandrenesana tsotra ho an'i Madagasikara
export const DEFAULT_ALERTS: Alert[] = [
  {
    id: '1',
    titre: 'Ahiana hisy orambe rahampitso',
    description: 'Toetrandro: Hisy rotsakorana ny maraina rahampitso. Jereo tsara ny lalan-drano any an-tsaha.',
    type: 'meteo',
    severite: 'warning',
    date: new Date().toISOString().split('T')[0],
    valide: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    titre: 'Fampitandremana: Main-tany be ny andro',
    description: 'Faritra: Tsikaritra fa maharitra loatra ny hain-tany. Manoro hevitra ny hanondraka ny voly.',
    type: 'meteo',
    severite: 'danger',
    date: new Date().toISOString().split('T')[0],
    valide: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    titre: 'Fidiran’ny valala mpifindra monina',
    description: 'Bibikely mpanimba: Nisy andiam-balala hita tany amin’ny faritra Androy. Raiso ny fepetra tandrify izany.',
    type: 'parasite',
    severite: 'critical',
    date: new Date().toISOString().split('T')[0],
    valide: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];