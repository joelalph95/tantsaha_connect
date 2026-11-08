const express = require('express');
const router = express.Router();

// Route d'inscription
router.post('/register', (req, res) => {
  console.log('Requête POST reçue sur /register');
  res.json({ 
    message: 'Route register fonctionne!',
    data: req.body 
  });
});

// Route de connexion
router.post('/login', (req, res) => {
  console.log('Requête POST reçue sur /login');
  res.json({ 
    message: 'Route login fonctionne!',
    data: req.body 
  });
});

module.exports = router;