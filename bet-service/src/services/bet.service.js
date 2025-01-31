// src/services/bet.service.js
const Bet = require('../models/bet.model');
const axios = require('axios');


/**
 * 📌 Placer un pari (simple ou combiné)
 */
exports.placeBet = async (userId, betData) => {
  let totalOdd = 1;
  
  // Vérifier que tous les matchs du pari existent et sont encore "upcoming"
  for (const bet of betData.bets) {
    const matchResponse = await axios.get(`${process.env.MATCH_SERVICE_URL}/matches/${bet.matchId}`);
    const match = matchResponse.data;
    
    if (!match || match.status !== "upcoming") {
      throw new Error("Le match sélectionné n'est pas disponible pour les paris.");
    }
    
    totalOdd *= bet.odd;
  }

  // Calcul du gain potentiel
  const potentialGain = betData.amount * totalOdd;

  const newBet = new Bet({
    userId,
    type: betData.type,
    bets: betData.bets,
    amount: betData.amount,
    potentialGain
  });

  await newBet.save();
  return newBet;
};

/**
 * 📌 Récupérer tous les paris d’un utilisateur
 */
exports.getUserBets = async (userId) => {
  return Bet.find({ userId }).sort({ createdAt: -1 });
};

/**
 * 📌 Mettre à jour les paris après la fin des matchs
 */
exports.updateBetResults = async () => {
  const finishedMatchesResponse = await axios.get(`${process.env.MATCH_SERVICE_URL}/matches?status=finished`);
  const finishedMatches = finishedMatchesResponse.data;

  for (const match of finishedMatches) {
    const bets = await Bet.find({ "bets.matchId": match._id, status: "pending" });

    for (const bet of bets) {
      let won = true;

      for (const singleBet of bet.bets) {
        if (
          (singleBet.betType === "homeWin" && match.score.home <= match.score.away) ||
          (singleBet.betType === "awayWin" && match.score.away <= match.score.home) ||
          (singleBet.betType === "draw" && match.score.home !== match.score.away)
        ) {
          won = false;
          break;
        }
      }

      bet.status = won ? "won" : "lost";
      await bet.save();
    }
  }
};
