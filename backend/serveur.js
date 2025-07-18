// backend/serveur.js (Version Corrigée)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const exerciceRoutes = require('./src/routes/exerciceRoutes');
// VÉRIFIEZ BIEN QUE CETTE LIGNE EST PRÉSENTE :
const equipementRoutes = require('./src/routes/equipementRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Utiliser les routes des exercices
app.use('/api/exercices', exerciceRoutes);

// Utiliser les routes des équipements
app.use('/api/equipements', equipementRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});