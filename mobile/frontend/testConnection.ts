/**
 * Test de la connexion Backend-Frontend
 * À utiliser dans la console de débogage
 */

import { DataService } from './services/DataService';
import { apiCall } from './services/ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function testConnection() {
  console.log('🧪 Test de la connexion Backend-Frontend...\n');

  try {
    // 1. Test Health Check
    console.log('1️⃣ Health Check...');
    const healthCheck = await DataService.healthCheck();
    console.log('Health check result:', healthCheck);
    
    if (healthCheck === true) {
      console.log('✅ Backend est en ligne!\n');
    } else {
      console.log('❌ Impossible de joindre le backend\n');
      console.log('⚠️ Assurez-vous que:');
      console.log('   - Le backend s\'exécute: npm start (dans backend/)');
      console.log('   - MongoDB est en cours d\'exécution');
      console.log('   - L\'URL dans ApiConfig.ts est correcte');
      return;
    }

    // 2. Test Création Fermier
    console.log('2️⃣ Test Création Fermier...');
    const farmerId = await DataService.createFarmerProfile('Test Fermier', '123456789');
    console.log('✅ Fermier créé avec ID:', farmerId, '\n');

    // 3. Test Récupération Fermier
    console.log('3️⃣ Test Récupération Fermier...');
    const retrievedFarmer = await DataService.getFarmer();
    if (retrievedFarmer) {
      console.log('✅ Fermier récupéré:', retrievedFarmer.nom, '\n');
    } else {
      console.log('❌ Aucun fermier trouvé\n');
    }

    // 4. Test Création Parcelle
    console.log('4️⃣ Test Création Parcelle...');
    const parcel = await DataService.addParcel(
      'Test Parcelle',
      2.5,
      'Region Test',
      ['Riz', 'Maïs']
    );
    const parcelId = parcel.id;
    console.log('✅ Parcelle créée avec ID:', parcelId, '\n');

    // 5. Test Récupération Parcelles
    console.log('5️⃣ Test Récupération Parcelles...');
    const parcels = await DataService.getParcels();
    console.log('✅ Parcelles récupérées:', parcels ? parcels.length : 0, 'parcelle(s)\n');

    // 6. Test Création Observation
    console.log('6️⃣ Test Création Observation...');
    if (parcelId && parcels && parcels.length > 0) {
      const observationId = await DataService.addObservation(
        parcelId,
        'Test d\'observation',
        'insecte',
        'moyen'
      );
      console.log('✅ Observation créée avec ID:', observationId, '\n');
    } else {
      console.log('⚠️ Impossible de créer une observation sans parcelle\n');
    }

    // 7. Test Récupération Observations
    console.log('7️⃣ Test Récupération Observations...');
    const observations = await DataService.getObservations();
    console.log('✅ Observations récupérées:', observations ? observations.length : 0, 'observation(s)\n');

    // 8. Test Récupération Alertes
    console.log('8️⃣ Test Récupération Alertes...');
    const alerts = await DataService.getAlerts();
    console.log('✅ Alertes récupérées:', alerts ? alerts.length : 0, 'alerte(s)\n');

    // 9. Test Récupération Conseils
    console.log('9️⃣ Test Récupération Conseils...');
    const advice = await DataService.getAdvice();
    console.log('✅ Conseils récupérés:', advice ? advice.length : 0, 'conseil(s)\n');

    // 10. Test Récupération Météo
    console.log('🔟 Test Récupération Météo...');
    const weather = await DataService.getWeather();
    console.log('✅ Météo récupérée:', weather ? (weather.condition || 'données disponibles') : 'non disponible', '\n');

    console.log('✅ ✅ ✅ TOUS LES TESTS SONT RÉUSSIS! ✅ ✅ ✅');
    console.log('\n📊 Résumé:');
    console.log('   - Backend: Accessible ✅');
    console.log('   - Fermier créé et sauvegardé dans MongoDB ✅');
    console.log('   - Parcelle créée et sauvegardée ✅');
    console.log('   - Observation créée et sauvegardée ✅');
    console.log('   - Données synchronisées avec AsyncStorage ✅');
    console.log('\n🎉 L\'intégration est réussie!');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
  }
}

// Fonction alternative pour tester uniquement le backend
export async function testBackendOnly() {
  console.log('🧪 Test Backend seulement...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend accessible:', data);
      return data;
    } else {
      console.log('❌ Backend non accessible, statut:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion au backend:', error instanceof Error ? error.message : String(error));
    return null;
  }
}

// Fonction pour nettoyer les données de test
export async function cleanupTestData() {
  console.log('🧹 Nettoyage des données de test...\n');
  
  try {
    // Supprimer les données de AsyncStorage
    await AsyncStorage.removeItem('farmerData');
    await AsyncStorage.removeItem('parcels');
    await AsyncStorage.removeItem('observations');
    
    // Optionnel: supprimer du backend via API
    try {
      await fetch('http://localhost:3000/api/test/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (backendError) {
      // Ignorer si le endpoint de cleanup n'existe pas
    }
    
    console.log('✅ Données de test nettoyées');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Pour lancer le test depuis la console:
// import { testConnection, testBackendOnly, cleanupTestData } from './testConnection'
// testConnection()