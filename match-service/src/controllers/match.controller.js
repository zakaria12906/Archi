// src/controllers/match.controller.js
const MatchService = require('../services/match.service');

/**
 * 📥 Importe les matchs depuis un fichier CSV stocké dans `data/`
 * ✅ Accessible uniquement aux bookmakers et admins
 */
exports.importMatches = async (req, res) => {
  try {
    const result = await MatchService.importMatchesFromCSV();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📌 Création d’un match (Réservé aux bookmakers)
 */
exports.createMatch = async (req, res) => {
  try {
    const match = await MatchService.createMatch(req.body);
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * 📌 Récupérer tous les matchs triés par date
 */
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await MatchService.getAllMatches();
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📌 Met à jour les cotes d'un match (Réservé aux bookmakers)
 */
exports.updateOdds = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMatch = await MatchService.updateOdds(id, req.body);
    res.status(200).json(updatedMatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * 📌 Met à jour le statut d’un match (upcoming → in_progress → finished)
 */
exports.updateMatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedMatch = await MatchService.updateMatchStatus(id, status);
    res.status(200).json(updatedMatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/**
 * 📌 Suppression d’un match
 */
exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMatch = await MatchService.deleteMatch(id);

    if (!deletedMatch) {
      return res.status(404).json({ error: "Match introuvable" });
    }

    return res.status(200).json({ message: "Match supprimé avec succès" });
  } catch (err) {
    console.error("[Match Controller] deleteMatch error:", err);
    return res.status(500).json({ error: err.message });
  }
};
