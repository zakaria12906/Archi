// src/routes/team.routes.js
const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/team.controller');
const { verifyToken, isBookmaker } = require('../middlewares/auth.middleware');

// 📌 Récupérer toutes les équipes
router.get('/', TeamController.getAllTeams);

// 📥 Importer les équipes (Réservé aux bookmakers et admins)
router.post('/import', verifyToken, isBookmaker, TeamController.importTeams);

module.exports = router;
