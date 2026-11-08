const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

/* =========================
   MIDDLEWARES
========================= */

// Autoriser les requêtes JSON
app.use(express.json());

// Autoriser les requêtes depuis le réseau (PC + mobile)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* =========================
   ROUTES DE TEST
========================= */

// Test simple
app.get('/', (req, res) => {
  res.json({ message: 'API backend fonctionne ✅' });
});

// Test API
app.get('/api/test', (req, res) => {
  res.json({ status: 'success', message: 'API accessible depuis mobile 📱' });
});

// Exemple login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'test@test.com' && password === '1234') {
    return res.json({
      token: 'fake-jwt-token',
      user: { email }
    });
  }

  res.status(401).json({ message: 'Email ou mot de passe incorrect' });
});

/* =========================
   SERVEUR
========================= */

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API accessible sur :
  - http://localhost:${PORT}
  - http://IP_DU_PC:${PORT}`);
});
