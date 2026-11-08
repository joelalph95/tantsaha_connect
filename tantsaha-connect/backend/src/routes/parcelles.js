const express = require('express');
const router = express.Router();
const Parcelle = require('../models/Parcelle');

// GET toutes les parcelles
router.get('/', (req, res) => {
  Parcelle.getAll((err, parcelles) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(parcelles);
  });
});

// GET parcelles d'un paysan
router.get('/paysan/:id_paysan', (req, res) => {
  const { id_paysan } = req.params;
  Parcelle.getByPaysan(id_paysan, (err, parcelles) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(parcelles);
  });
});

// GET une parcelle par ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Parcelle.getById(id, (err, parcelle) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!parcelle) {
      return res.status(404).json({ error: 'Parcelle non trouvée' });
    }
    res.json(parcelle);
  });
});

// POST créer une parcelle
router.post('/', (req, res) => {
  const parcelle = req.body;
  
  // Validation
  if (!parcelle.nom_parcelle || !parcelle.id_paysan) {
    return res.status(400).json({ error: 'Nom de parcelle et ID paysan sont requis' });
  }

  Parcelle.create(parcelle, (err, newParcelle) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newParcelle);
  });
});

// PUT mettre à jour une parcelle
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const parcelle = req.body;

  Parcelle.update(id, parcelle, (err, updatedParcelle) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(updatedParcelle);
  });
});

// DELETE supprimer une parcelle
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Parcelle.delete(id, (err, success) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!success) {
      return res.status(404).json({ error: 'Parcelle non trouvée' });
    }
    res.json({ message: 'Parcelle supprimée avec succès' });
  });
});

// POST ajouter un produit à une parcelle
router.post('/:id_parcelle/produits/:id_produit', (req, res) => {
  const { id_parcelle, id_produit } = req.params;
  const data = req.body;

  Parcelle.addProduit(id_parcelle, id_produit, data, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

module.exports = router;