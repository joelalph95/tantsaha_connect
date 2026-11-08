/**
 * API Configuration
 */

// Pour localhost sur Expo:
// - Android Emulator: 10.0.2.2 (l'adresse spéciale pour localhost)
// - iOS Simulator: localhost ou 127.0.0.1
// - Physical device: IP réelle de votre machine (obtenu via ipconfig)

// ⚠️ IMPORTANT: Pour Physical Device, remplace cette IP par ton IP locale
// Tape ipconfig dans l'invite de commande et utilise l'adresse IPv4
const MACHINE_IP = ' 192.168.43.86';  // ← CHANGE CECI par ton IP réelle

export const API_CONFIG = {
  // Change ceci par l'IP de ta machine (ex: 192.168.1.10)
  // Pour tester en local: http://localhost:5000
  BASE_URL: `http://${MACHINE_IP}:5000/api`,
  
  // Options alternatives si la première ne marche pas:
  // BASE_URL: 'http://10.0.2.2:5000/api',  // Android Emulator
  // BASE_URL: 'http://localhost:5000/api',  // iOS Simulator
};

/**
 * Effectue une requête fetch avec gestion d'erreur
 */
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error);
    throw error;
  }
};
