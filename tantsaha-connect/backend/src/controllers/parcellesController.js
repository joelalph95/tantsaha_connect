const Parcelle = require('../models/Parcelle');

exports.getAllParcelles = (req, res) => {
  Parcelle.getAll((err, parcelles) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(parcelles);
  });
};

exports.getParcelleById = (req, res) => {
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
};

exports.createParcelle = (req, res) => {
  const parcelle = req.body;
  
  if (!parcelle.nom_parcelle || !parcelle.id_paysan) {
    return res.status(400).json({ error: 'Nom de parcelle et ID paysan sont requis' });
  }

  Parcelle.create(parcelle, (err, newParcelle) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newParcelle);
  });
};

exports.updateParcelle = (req, res) => {
  const { id } = req.params;
  const parcelle = req.body;

  Parcelle.update(id, parcelle, (err, updatedParcelle) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(updatedParcelle);
  });
};

exports.deleteParcelle = (req, res) => {
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
};