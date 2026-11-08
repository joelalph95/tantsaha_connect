require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import des routes
const paysansRoutes = require('./routes/paysans');
const parcellesRoutes = require('./routes/parcelles');
const meteoRoutes = require('./routes/meteo');
const authRoutes = require('./routes/auth'); // <-- import auth ici

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Routes API
app.use('/api/paysans', paysansRoutes);
app.use('/api/parcelles', parcellesRoutes);
app.use('/api/meteo', meteoRoutes);
app.use('/api/auth', authRoutes); // <-- ajouter la route auth ici

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Tantsaha Connect API est en ligne',
    timestamp: new Date().toISOString()
  });
});

// Route racine (page HTML simple)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Tantsaha Connect API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .container { max-width: 800px; margin: 0 auto; }
          .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌱 Tantsaha Connect API</h1>
          <p>Bienvenue sur l'API du système Tantsaha Connect</p>
          
          <h2>Endpoints disponibles:</h2>
          <div class="endpoint"><strong>GET /api/health</strong> - Vérifier l'état de l'API</div>
          <div class="endpoint"><strong>GET /api/paysans</strong> - Liste des paysans</div>
          <div class="endpoint"><strong>GET /api/parcelles</strong> - Liste des parcelles</div>
          <div class="endpoint"><strong>GET /api/meteo/today/:id_paysan</strong> - Météo du jour</div>
          <div class="endpoint"><strong>POST /api/auth/login</strong> - Connexion utilisateur</div>
          <div class="endpoint"><strong>POST /api/auth/register</strong> - Inscription utilisateur</div>
          
          <h2>Documentation:</h2>
          <p>Utilisez Postman ou Thunder Client pour tester les endpoints.</p>
        </div>
      </body>
    </html>
  `);
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue sur le serveur' });
});

// Port d'écoute
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🌐 Testez l'API: http://localhost:${PORT}/api/health`);
});
