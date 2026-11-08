const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');

// GET - Récupérer tous les fermiers
router.get('/', async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer un fermier par ID
router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ error: 'Fermier non trouvé' });
    }
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouveau fermier
router.post('/', async (req, res) => {
  try {
    const { nom, telephone, email, region, district, commune } = req.body;
    const farmer = new Farmer({
      nom,
      telephone,
      email,
      region,
      district,
      commune,
    });
    const savedFarmer = await farmer.save();
    res.status(201).json(savedFarmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Mettre à jour un fermier
router.put('/:id', async (req, res) => {
  try {
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFarmer) {
      return res.status(404).json({ error: 'Fermier non trouvé' });
    }
    res.json(updatedFarmer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer un fermier
router.delete('/:id', async (req, res) => {
  try {
    const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!deletedFarmer) {
      return res.status(404).json({ error: 'Fermier non trouvé' });
    }
    res.json({ message: 'Fermier supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
