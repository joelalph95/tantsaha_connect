const express = require('express');
const router = express.Router();
const Observation = require('../models/Observation');

// GET - Récupérer toutes les observations d'un fermier
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const observations = await Observation.find({ farmerId: req.params.farmerId })
      .populate('parcelId');
    res.json(observations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer une observation par ID
router.get('/:id', async (req, res) => {
  try {
    const observation = await Observation.findById(req.params.id)
      .populate('parcelId');
    if (!observation) {
      return res.status(404).json({ error: 'Observation non trouvée' });
    }
    res.json(observation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer une nouvelle observation
router.post('/', async (req, res) => {
  try {
    const { farmerId, parcelId, type, description, severite, images, actionsPrises } = req.body;
    const observation = new Observation({
      farmerId,
      parcelId,
      type,
      description,
      severite,
      images,
      actionsPrises,
    });
    const savedObservation = await observation.save();
    res.status(201).json(savedObservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Mettre à jour une observation
router.put('/:id', async (req, res) => {
  try {
    const updatedObservation = await Observation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedObservation) {
      return res.status(404).json({ error: 'Observation non trouvée' });
    }
    res.json(updatedObservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer une observation
router.delete('/:id', async (req, res) => {
  try {
    const deletedObservation = await Observation.findByIdAndDelete(req.params.id);
    if (!deletedObservation) {
      return res.status(404).json({ error: 'Observation non trouvée' });
    }
    res.json({ message: 'Observation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
