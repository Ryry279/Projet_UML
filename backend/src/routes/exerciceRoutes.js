const express = require('express');
const db = require('../config/db');

const router = express.Router();

// --- Route 1 : Récupérer les exercices (avec filtre, recherche ET filtre par équipement) ---
router.get('/', async (req, res) => {
  try {
    // On récupère les possibles paramètres de l'URL
    const { groupe, recherche, equipement } = req.query;

    let params = [];
    // On utilise LEFT JOIN pour pouvoir filtrer sur la table des équipements
    let sql = `
        SELECT DISTINCT ex.* FROM exercices ex
        LEFT JOIN exercice_equipement ee ON ex.id_exercice = ee.id_exercice
        WHERE 1=1
    `;

    if (groupe && groupe !== 'Tous') {
      sql += ' AND ex.groupe_musculaire = ?';
      params.push(groupe);
    }
    if (recherche) {
      sql += ' AND ex.nom LIKE ?';
      params.push(`%${recherche}%`);
    }
    // --- NOUVELLE PARTIE ---
    // Si un ID d'équipement est fourni, on ajoute une condition
    if (equipement) {
        sql += ' AND ee.id_equipement = ?';
        params.push(equipement);
    }

    const [exercices] = await db.query(sql, params);
    res.json(exercices);

  } catch (error) {
    console.error("Erreur lors de la récupération des exercices:", error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

// --- Route 2 : Récupérer la liste unique des groupes musculaires ---
// (Aucun changement ici)
router.get('/groupes', async (req, res) => {
    try {
        const [groupes] = await db.query('SELECT DISTINCT groupe_musculaire FROM exercices ORDER BY groupe_musculaire ASC');
        const groupList = groupes.map(g => g.groupe_musculaire);
        res.json(groupList);
    } catch (error) {
        console.error("Erreur lors de la récupération des groupes musculaires:", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// --- Route 3 : Récupérer un "Programme du Jour" aléatoire ---
// (Aucun changement ici)
router.get('/programme-du-jour', async (req, res) => {
    try {
        const [programme] = await db.query('SELECT * FROM exercices ORDER BY RAND() LIMIT 4');
        res.json(programme);
    } catch (error) {
        console.error("Erreur lors de la génération du programme du jour:", error);
        res.status(500).json({ message: "Erreur du serveur." });
    }
});

// --- Route 4 : Récupérer UN SEUL exercice par son ID (avec ses équipements) ---
// Cette route dynamique doit être déclarée en dernier
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // --- REQUÊTE MODIFIÉE ---
    // On utilise des JOINTURES pour récupérer l'exercice ET la liste des équipements associés
    const sql = `
      SELECT 
        ex.*, 
        GROUP_CONCAT(eq.nom_equipement SEPARATOR ', ') AS equipements
      FROM exercices ex
      LEFT JOIN exercice_equipement ee ON ex.id_exercice = ee.id_exercice
      LEFT JOIN equipements eq ON ee.id_equipement = eq.id_equipement
      WHERE ex.id_exercice = ?
      GROUP BY ex.id_exercice;
    `;
    
    const [exercice] = await db.query(sql, [id]);

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