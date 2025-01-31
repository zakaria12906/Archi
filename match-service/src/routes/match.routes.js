// src/routes/match.routes.js
const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/match.controller');
const { verifyToken, isBookmaker } = require('../middlewares/auth.middleware');

// 📌 Récupérer tous les matchs
router.get('/', MatchController.getAllMatches);

// 📥 Importer les matchs (Réservé aux bookmakers et admins)
router.post('/import-csv', verifyToken, isBookmaker, MatchController.importMatches);

// 📌 Créer un match (Réservé aux bookmakers)
router.post('/', verifyToken, isBookmaker, MatchController.createMatch);

// 📌 Mettre à jour les cotes d’un match (Réservé aux bookmakers)
router.put('/:id/odds', verifyToken, isBookmaker, MatchController.updateOdds);

// 📌 Modifier le statut d’un match (Réservé aux bookmakers)
router.put('/:id/status', verifyToken, isBookmaker, MatchController.updateMatchStatus);
router.delete('/:id', verifyToken, isBookmaker, MatchController.deleteMatch);

module.exports = router;
