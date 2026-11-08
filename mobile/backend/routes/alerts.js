const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET - Récupérer toutes les alertes d'un fermier
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const alerts = await Alert.find({ farmerId: req.params.farmerId })
      .populate('parcelId');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer une alerte par ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer une nouvelle alerte
router.post('/', async (req, res) => {
  try {
    const { farmerId, parcelId, titre, description, severite, type, actions } = req.body;
    const alert = new Alert({
      farmerId,
      parcelId,
      titre,
      description,
      severite,
      type,
      actions,
    });
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Mettre à jour une alerte
router.put('/:id', async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAlert) {
      return res.status(404).json({ error: 'Tsy hita ny fampitandremana' });
    }
    res.json(updatedAlert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer une alerte
router.delete('/:id', async (req, res) => {
  try {
    const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
    if (!deletedAlert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }
    res.json({ message: 'Alerte supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
