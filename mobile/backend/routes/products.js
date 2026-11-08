const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET - Récupérer tous les produits d'un fermier
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.params.farmerId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouveau produit
router.post('/', async (req, res) => {
  try {
    const { farmerId, nom, type, quantite, unite, prixUnitaire, dateAchat, dateExpiration, fournisseur, notes } = req.body;
    const product = new Product({
      farmerId,
      nom,
      type,
      quantite,
      unite,
      prixUnitaire,
      dateAchat,
      dateExpiration,
      fournisseur,
      notes,
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT - Mettre à jour un produit
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
