const express = require('express');
const router = express.Router();
const Meteo = require('../models/Meteo');

// GET météo du jour
router.get('/today/:id_paysan', (req, res) => {
  const { id_paysan } = req.params;
  
  Meteo.getToday(id_paysan, (err, meteo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Si pas de données pour aujourd'hui, retourner des données par défaut
    if (!meteo) {
      meteo = {
        temperature: 25,
        humidite: 70,
        pluie: 'Faible',
        vent: '10 km/h',
        date_meteo: new Date().toISOString().split('T')[0]
      };
    }
    
    res.json(meteo);
  });
});

// GET prévisions (7 jours)
router.get('/forecast/:id_paysan', (req, res) => {
  const { id_paysan } = req.params;
  
  Meteo.getForecast(id_paysan, (err, forecast) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(forecast);
  });
});

// GET historique météo
router.get('/history/:id_paysan', (req, res) => {
  const { id_paysan } = req.params;
  const { start, end } = req.query;
  
  const startDate = start || new Date().toISOString().split('T')[0];
  const endDate = end || new Date().toISOString().split('T')[0];
  
  Meteo.getHistory(id_paysan, startDate, endDate, (err, history) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(history);
  });
});

// POST créer une entrée météo
router.post('/', (req, res) => {
  const meteo = req.body;
  
  // Validation
  if (!meteo.date_meteo || !meteo.id_paysan) {
    return res.status(400).json({ error: 'Date et ID paysan sont requis' });
  }

  Meteo.create(meteo, (err, newMeteo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newMeteo);
  });
});

// PUT mettre à jour les données météo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const meteo = req.body;

  Meteo.update(id, meteo, (err, updatedMeteo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(updatedMeteo);
  });
});

module.exports = router;