// src/services/transaction.service.js
const Bet = require('../models/bet.model');
const { publishEvent } = require('./mq.service');
const axios = require('axios');

/**
 * 📌 Traite le paiement des gains pour les paris gagnants
 */
exports.processBetPayments = async () => {
  try {
    const winningBets = await Bet.find({ status: "won" });

    for (const bet of winningBets) {
      // 🔹 Vérifier si l'utilisateur a un compte dans le Customer-Service
      const userBalanceResponse = await axios.get(`${process.env.CUSTOMERS_SERVICE_URL}/customers/${bet.userId}`);
      const userBalance = userBalanceResponse.data;

      if (!userBalance) {
        console.log(`[Paiement] Impossible de créditer l'utilisateur ${bet.userId}, compte introuvable.`);
        continue;
      }

      // 🔹 Créditer les gains de l'utilisateur
      await axios.put(`${process.env.CUSTOMERS_SERVICE_URL}/customers/${bet.userId}/credit`, {
        amount: bet.potentialGain
      });

      console.log(`[Paiement] Crédit de ${bet.potentialGain}€ pour l'utilisateur ${bet.userId}`);

      // 📌 Publier un événement RabbitMQ (paiement validé)
      await publishEvent('payment_success', {
        userId: bet.userId,
        amount: bet.potentialGain,
        betId: bet._id
      });

      // Marquer le paiement comme effectué
      bet.status = "paid";
      await bet.save();
    }
  } catch (error) {
    console.error("[Paiement] Erreur lors du traitement des paiements:", error);
  }
};
