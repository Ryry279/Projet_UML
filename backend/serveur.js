// backend/serveur.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importer les routes des exercices
const exerciceRoutes = require('./src/routes/exerciceRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Indiquer à Express d'utiliser les routes pour toute URL commençant par /api/exercices
app.use('/api/exercices', exerciceRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});