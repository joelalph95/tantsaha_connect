const express = require('express');
const router = express.Router();
const Parcel = require('../models/Parcel');

// GET - Récupérer toutes les parcelles d'un fermier
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const parcels = await Parcel.find({ farmerId: req.params.farmerId });
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer une parcelle par ID
router.get('/:id', async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({ error: 'Parcelle non trouvée' });
    }
    res.json(parcel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer une nouvelle parcelle
router.post('/', async (req, res) => {
  try {
    const { farmerId, nom, surface, localisation, location, cultures, dateDebut, etat } = req.body;
    const parcel = new Parcel({
      farmerId,
      nom,
      surface,
      localisation,
      location,
      cultures,
      dateDebut,
      etat,
    });
    const savedParcel = await parcel.save();
    res.status(201).json(savedParcel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Mettre à jour une parcelle
router.put('/:id', async (req, res) => {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedParcel) {
      return res.status(404).json({ error: 'Parcelle non trouvée' });
    }
    res.json(updatedParcel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer une parcelle
router.delete('/:id', async (req, res) => {
  try {
    const deletedParcel = await Parcel.findByIdAndDelete(req.params.id);
    if (!deletedParcel) {
      return res.status(404).json({ error: 'Parcelle non trouvée' });
    }
    res.json({ message: 'Parcelle supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
