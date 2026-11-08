const express = require('express');
const router = express.Router();
const axios = require('axios');
const Weather = require('../models/Weather');

// Fonction pour mapper les conditions météo de l'API
function mapWeatherCondition(apiCondition) {
  const conditionMap = {
    'Clear': 'ensoleille',
    'Clouds': 'nuageux',
    'Rain': 'pluvieux',
    'Drizzle': 'pluvieux',
    'Thunderstorm': 'orageux',
    'Snow': 'pluvieux', // Pas de neige à Madagascar
    'Mist': 'nuageux',
    'Fog': 'nuageux'
  };
  return conditionMap[apiCondition] || 'nuageux';
}

// GET - Récupérer les données météo d'un fermier
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    let weather = await Weather.findOne({ farmerId: req.params.farmerId });

    // Si pas de données en cache ou données anciennes (>1 heure), récupérer depuis l'API
    if (!weather || (new Date() - weather.updatedAt) > 3600000) {
      try {
        // Utiliser OpenWeatherMap API gratuite pour Madagascar (Antananarivo par défaut)
        const apiKey = process.env.OPENWEATHER_API_KEY || 'your_free_api_key_here';
        const city = 'Antananarivo,MG'; // Madagascar

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`);

        const weatherData = response.data;

        // Mapper les données de l'API
        const mappedData = {
          farmerId: req.params.farmerId,
          localisation: {
            ville: weatherData.name,
            latitude: weatherData.coord.lat,
            longitude: weatherData.coord.lon,
          },
          condition: mapWeatherCondition(weatherData.weather[0].main),
          temperature: Math.round(weatherData.main.temp),
          humidite: weatherData.main.humidity,
          vitesseVent: weatherData.wind.speed,
          precipitations: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
          indiceUV: 0, // OpenWeatherMap free tier ne fournit pas l'UV
          previsions: [], // Prévisions limitées dans free tier
        };

        // Sauvegarder ou mettre à jour en base
        if (weather) {
          weather = await Weather.findOneAndUpdate(
            { farmerId: req.params.farmerId },
            mappedData,
            { new: true, upsert: true }
          );
        } else {
          weather = new Weather(mappedData);
          await weather.save();
        }
      } catch (apiError) {
        console.warn('Erreur API météo, utilisation des données en cache:', apiError.message);
        // Si l'API échoue et pas de données en cache, retourner une erreur
        if (!weather) {
          return res.status(503).json({ error: 'Service météo indisponible' });
        }
      }
    }

    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer des données météo par ID
router.get('/:id', async (req, res) => {
  try {
    const weather = await Weather.findById(req.params.id);
    if (!weather) {
      return res.status(404).json({ error: 'Données météo non trouvées' });
    }
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer/Mettre à jour les données météo
router.post('/', async (req, res) => {
  try {
    const { farmerId, localisation, condition, temperature, humidite, vitesseVent, precipitations, indiceUV, previsions } = req.body;
    
    let weather = await Weather.findOne({ farmerId });
    
    if (weather) {
      // Mettre à jour
      weather.localisation = localisation || weather.localisation;
      weather.condition = condition || weather.condition;
      weather.temperature = temperature !== undefined ? temperature : weather.temperature;
      weather.humidite = humidite !== undefined ? humidite : weather.humidite;
      weather.vitesseVent = vitesseVent !== undefined ? vitesseVent : weather.vitesseVent;
      weather.precipitations = precipitations !== undefined ? precipitations : weather.precipitations;
      weather.indiceUV = indiceUV !== undefined ? indiceUV : weather.indiceUV;
      if (previsions) weather.previsions = previsions;
    } else {
      // Créer
      weather = new Weather({
        farmerId,
        localisation,
        condition,
        temperature,
        humidite,
        vitesseVent,
        precipitations,
        indiceUV,
        previsions,
      });
    }
    
    const savedWeather = await weather.save();
    res.status(201).json(savedWeather);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer les données météo
router.delete('/:id', async (req, res) => {
  try {
    const deletedWeather = await Weather.findByIdAndDelete(req.params.id);
    if (!deletedWeather) {
      return res.status(404).json({ error: 'Données météo non trouvées' });
    }
    res.json({ message: 'Données météo supprimées avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
