/**
 * PARAMETRES
 * Paramètres et préférences utilisateur
 */
export interface AppParameters {
  id: string;
  farmerId: string;
  langue: 'fr' | 'mg' | 'en';
  notifications: boolean;
  mode_offline: boolean;
  theme: 'light' | 'dark';
  notifications_frequence: 'immediate' | 'daily' | 'weekly';
  createdAt: string;
  updatedAt: string;
}

export const createAppParameters = (data: Partial<AppParameters>, farmerId: string): AppParameters => ({
  id: data.id || Math.random().toString(36).substr(2, 9),
  farmerId: farmerId,
  langue: data.langue || 'fr',
  notifications: data.notifications !== undefined ? data.notifications : true,
  mode_offline: data.mode_offline !== undefined ? data.mode_offline : true,
  theme: data.theme || 'light',
  notifications_frequence: data.notifications_frequence || 'immediate',
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

export const DEFAULT_PARAMETERS: AppParameters = {
  id: '1',
  farmerId: 'default',
  langue: 'fr',
  notifications: true,
  mode_offline: true,
  theme: 'light',
  notifications_frequence: 'daily',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
