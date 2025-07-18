// fonction abandonnée et laisser simplement pour faire des branch sur git
// backend/src/routes/equipementRoutes.js
const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Route pour récupérer TOUS les équipements
// GET /api/equipements
router.get('/', async (req, res) => {
  try {
    const [equipements] = await db.query('SELECT * FROM equipements ORDER BY nom_equipement ASC');
    res.json(equipements);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipements:", error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

module.exports = router;