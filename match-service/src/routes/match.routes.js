// src/routes/match.routes.js
const router = require('express').Router();
const MatchController = require('../controllers/match.controller');
const { verifyToken, isBookmakerOrAdmin } = require('../middlewares/auth.middleware');

// 1. Lecture
router.get('/', MatchController.getAllMatches); // accessible à tous
router.get('/:id', MatchController.getMatchById); // accessible à tous

// 2. Création, mise à jour, suppression (protégé)
router.post('/', verifyToken, isBookmakerOrAdmin, MatchController.createMatch);
router.put('/:id', verifyToken, isBookmakerOrAdmin, MatchController.updateMatch);
router.delete('/:id', verifyToken, isBookmakerOrAdmin, MatchController.deleteMatch);

// 3. Mise à jour spécifique des cotes
router.put('/:id/odds', verifyToken, isBookmakerOrAdmin, MatchController.updateOdds);

// 4. Mettre en avant (featured)
router.put('/:id/featured', verifyToken, isBookmakerOrAdmin, MatchController.setFeatured);

// 5. Démarrer et terminer un match
router.post('/:id/start', verifyToken, isBookmakerOrAdmin, MatchController.startMatch);
router.post('/:id/finish', verifyToken, isBookmakerOrAdmin, MatchController.finishMatch);

module.exports = router;
