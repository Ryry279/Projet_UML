// src/routes/exerciceRoutes.js (corrigé)
const express = require('express');
const db = require('../config/db');

const router = express.Router();

// --- Route 1 : Récupérer TOUS les exercices ---
router.get('/', async (req, res) => {
  try {
    const [exercices] = await db.query('SELECT * FROM exercices');
    res.json(exercices);
  } catch (error) {
    console.error("Erreur lors de la récupération des exercices:", error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

// --- Route 2 : Récupérer un "Programme du Jour" aléatoire ---
// CETTE ROUTE DOIT ÊTRE AVANT CELLE AVEC /:id
router.get('/programme-du-jour', async (req, res) => {
    try {
        const [programme] = await db.query('SELECT * FROM exercices ORDER BY RAND() LIMIT 4');
        res.json(programme);
    } catch (error) {
        console.error("Erreur lors de la génération du programme du jour:", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// --- Route 3 : Récupérer UN SEUL exercice par son ID ---
// CETTE ROUTE VIENT APRÈS LES AUTRES ROUTES GET PLUS SPÉCIFIQUES
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [exercice] = await db.query('SELECT * FROM exercices WHERE id_exercice = ?', [id]);
    if (exercice.length === 0) {
      return res.status(404).json({ message: "Exercice non trouvé." });
    }
    res.json(exercice[0]);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'exercice ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

module.exports = router;