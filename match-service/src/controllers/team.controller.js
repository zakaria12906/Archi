// src/controllers/team.controller.js
const TeamService = require('../services/team.service');

/**
 * 📥 Importe les équipes depuis un fichier JSON stocké dans `data/`
 * ✅ Accessible uniquement aux bookmakers et admins
 */
exports.importTeams = async (req, res) => {
  try {
    const result = await TeamService.importTeamsFromJSON();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 📌 Récupère toutes les équipes triées par leur coefficient UEFA
 */
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await TeamService.getAllTeams();
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
