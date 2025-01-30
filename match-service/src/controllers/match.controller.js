// src/controllers/match.controller.js
const MatchService = require('../services/match.service');

exports.createMatch = async (req, res) => {
  try {
    const matchData = req.body; // { teams, date, odds, etc. }
    const newMatch = await MatchService.createMatch(matchData);
    return res.status(201).json(newMatch);
  } catch (err) {
    console.error("createMatch error:", err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getAllMatches = async (req, res) => {
  try {
    const matches = await MatchService.getAllMatches();
    return res.status(200).json(matches);
  } catch (err) {
    console.error("getAllMatches error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMatchById = async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await MatchService.getMatchById(matchId);
    if (!match) return res.status(404).json({ error: "Match not found" });
    return res.status(200).json(match);
  } catch (err) {
    console.error("getMatchById error:", err);
    return res.status(400).json({ error: err.message });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const updated = await MatchService.updateMatch(matchId, req.body);
    if (!updated) return res.status(404).json({ error: "Match not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("updateMatch error:", err);
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const deleted = await MatchService.deleteMatch(matchId);
    if (!deleted) return res.status(404).json({ error: "Match not found" });
    return res.status(200).json({ message: "Match deleted" });
  } catch (err) {
    console.error("deleteMatch error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Mettre à jour les cotes
exports.updateOdds = async (req, res) => {
  try {
    const matchId = req.params.id;
    const newOdds = req.body; // ex: { homeWin: 1.5, draw: 3.2, awayWin: 2.0 }
    const match = await MatchService.updateOdds(matchId, newOdds);
    return res.status(200).json(match);
  } catch (err) {
    console.error("updateOdds error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Mettre en avant / feature
exports.setFeatured = async (req, res) => {
  try {
    const matchId = req.params.id;
    const { featured } = req.body; // boolean
    const match = await MatchService.setFeatured(matchId, featured);
    return res.status(200).json(match);
  } catch (err) {
    console.error("setFeatured error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Démarrer le match
exports.startMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await MatchService.startMatch(matchId);
    return res.status(200).json(match);
  } catch (err) {
    console.error("startMatch error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Terminer le match
exports.finishMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const { homeScore, awayScore } = req.body; // ex: { homeScore: 2, awayScore: 1 }
    const match = await MatchService.finishMatch(matchId, homeScore, awayScore);
    return res.status(200).json(match);
  } catch (err) {
    console.error("finishMatch error:", err);
    return res.status(400).json({ error: err.message });
  }
};
