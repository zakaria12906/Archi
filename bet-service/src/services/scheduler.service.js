// src/services/scheduler.service.js
const cron = require('node-cron');
const BetService = require('./bet.service');
const TransactionService = require('./transaction.service');


exports.startScheduler = () => {
  // Toutes les minutes, on vérifie et met à jour les paris
  cron.schedule('* * * * *', async () => {
    try {
      console.log(" [Scheduler] Mise à jour des résultats des paris...");
      await BetService.updateBetResults();
      console.log(" [Scheduler] Résultats des paris mis à jour.");

      console.log("⏳ [Scheduler] Traitement des paiements des paris gagnants...");
      await TransactionService.processBetPayments();
      console.log(" [Scheduler] Paiements des gains effectués.");
    } catch (err) {
      console.error(" [Scheduler] Erreur :", err);
    }
  });
};
