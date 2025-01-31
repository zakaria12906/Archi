// src/controllers/bet.controller.js
const BetService = require('../services/bet.service');
const TransactionService = require('../services/transaction.service');

/**
 * 📌 Placer un pari
 */
exports.placeBet = async (req, res) => {
  try {
    const userId = req.user.id; // Récupération de l'utilisateur depuis le token
    const bet = await BetService.placeBet(userId, req.body);
    res.status(201).json(bet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * 📌 Récupérer tous les paris d’un utilisateur
 */
exports.getUserBets = async (req, res) => {
  try {
    const userId = req.user.id;
    const bets = await BetService.getUserBets(userId);
    res.status(200).json(bets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📌 Mettre à jour les résultats des paris
 */
exports.updateBetResults = async (req, res) => {
  try {
    await BetService.updateBetResults();
    res.status(200).json({ message: "Mise à jour des résultats des paris effectuée." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📌 Traiter les paiements des paris gagnants
 */
exports.processPayments = async (req, res) => {
  try {
    await TransactionService.processBetPayments();
    res.status(200).json({ message: "Paiement des gains effectué avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
