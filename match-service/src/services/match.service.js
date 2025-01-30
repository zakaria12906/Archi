// src/services/match.service.js
const Match = require('../models/match.model');

// Créer un match
exports.createMatch = async (data) => {
  const match = new Match(data);
  await match.save();
  return match;
};

// Obtenir tous les matchs (optionnel : filtrer par statut, date, etc.)
exports.getAllMatches = async () => {
  return Match.find().sort({ date: 1 });
};

// Obtenir un match par son ID
exports.getMatchById = async (matchId) => {
  return Match.findById(matchId);
};

// Mettre à jour un match (données générales)
exports.updateMatch = async (matchId, data) => {
  return Match.findByIdAndUpdate(matchId, data, { new: true });
};

// Supprimer un match
exports.deleteMatch = async (matchId) => {
  return Match.findByIdAndDelete(matchId);
};

// Mettre à jour les cotes
exports.updateOdds = async (matchId, newOdds) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match not found");

  // newOdds est un objet, ex: { homeWin: 1.5, draw: 3.2 }
  for (const key in newOdds) {
    match.odds.set(key, newOdds[key]);
  }
  await match.save();
  return match;
};

// Mettre un match en featured ou non
exports.setFeatured = async (matchId, featured) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match not found");
  match.featured = featured;
  await match.save();
  return match;
};

// Passer un match en in_progress
exports.startMatch = async (matchId) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match not found");
  if (match.status !== "upcoming") {
    throw new Error("Match is not in upcoming status");
  }
  match.status = "in_progress";
  await match.save();
  return match;
};

// Passer un match en finished (avec un score final)
exports.finishMatch = async (matchId, scoreHome, scoreAway) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match not found");
  if (match.status !== "in_progress") {
    throw new Error("Match is not in in_progress status");
  }
  match.score.home = scoreHome;
  match.score.away = scoreAway;
  match.status = "finished";
  await match.save();
  return match;
};
