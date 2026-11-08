const express = require('express');
const router = express.Router();
const Paysan = require('../models/Paysan');

// GET tous les paysans
router.get('/', (req, res) => {
  Paysan.getAll((err, paysans) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(paysans);
  });
});

// GET un paysan par ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Paysan.getById(id, (err, paysan) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!paysan) {
      return res.status(404).json({ error: 'Paysan non trouvé' });
    }
    res.json(paysan);
  });
});

// POST créer un paysan
router.post('/', (req, res) => {
  const paysan = req.body;
  
  // Validation
  if (!paysan.nom || !paysan.prenom) {
    return res.status(400).json({ error: 'Nom et prénom sont requis' });
  }

  Paysan.create(paysan, (err, newPaysan) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newPaysan);
  });
});

// PUT mettre à jour un paysan
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const paysan = req.body;

  Paysan.update(id, paysan, (err, updatedPaysan) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(updatedPaysan);
  });
});

// DELETE supprimer un paysan
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Paysan.delete(id, (err, success) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!success) {
      return res.status(404).json({ error: 'Paysan non trouvé' });
    }
    res.json({ message: 'Paysan supprimé avec succès' });
  });
});

module.exports = router;