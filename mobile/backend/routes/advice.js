const express = require('express');
const router = express.Router();
const Advice = require('../models/Advice');

// GET - Récupérer tous les conseils d'un fermier
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const advices = await Advice.find({ farmerId: req.params.farmerId });
    res.json(advices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer un conseil par ID
router.get('/:id', async (req, res) => {
  try {
    const advice = await Advice.findById(req.params.id);
    if (!advice) {
      return res.status(404).json({ error: 'Conseil non trouvé' });
    }
    res.json(advice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouveau conseil
router.post('/', async (req, res) => {
  try {
    const { farmerId, titre, description, contenu, categorie, source, datePublication } = req.body;
    const advice = new Advice({
      farmerId,
      titre,
      description,
      contenu,
      categorie,
      source,
      datePublication,
    });
    const savedAdvice = await advice.save();
    res.status(201).json(savedAdvice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Mettre à jour un conseil
router.put('/:id', async (req, res) => {
  try {
    const updatedAdvice = await Advice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAdvice) {
      return res.status(404).json({ error: 'Conseil non trouvé' });
    }
    res.json(updatedAdvice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer un conseil
router.delete('/:id', async (req, res) => {
  try {
    const deletedAdvice = await Advice.findByIdAndDelete(req.params.id);
    if (!deletedAdvice) {
      return res.status(404).json({ error: 'Conseil non trouvé' });
    }
    res.json({ message: 'Conseil supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
