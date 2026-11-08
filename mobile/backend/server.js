const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Connexion MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend en ligne!', timestamp: new Date() });
});

// Routes API
app.use('/api/farmers', require('./routes/farmers'));
app.use('/api/parcels', require('./routes/parcels'));
app.use('/api/observations', require('./routes/observations'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/advice', require('./routes/advice'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/products', require('./routes/products'));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
