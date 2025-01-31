// src/routes/bet.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');

const BetController = require('../controllers/bet.controller');


//  Placer un pari (Utilisateur authentifié uniquement)
router.post('/', verifyToken, BetController.placeBet);

//  Récupérer tous les paris de l'utilisateur connecté
router.get('/', verifyToken, BetController.getUserBets);

//  Mettre à jour les résultats des paris (appelé par le scheduler)
router.post('/update-results', BetController.updateBetResults);

//  Effectuer les paiements des paris gagnants (appelé par le scheduler)
router.post('/process-payments', BetController.processPayments);

module.exports = router;
