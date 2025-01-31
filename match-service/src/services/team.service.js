// src/services/team.service.js
const fs = require('fs');
const path = require('path');
const Team = require('../models/team.model');

/**
 * 📥 Importe les équipes depuis un fichier JSON stocké dans `data/`
 */
exports.importTeamsFromJSON = async () => {
  try {
    const filePath = path.join(__dirname, '../../data/champions-league-24-25-teams.json');

    if (!fs.existsSync(filePath)) {
      throw new Error(`Fichier introuvable : ${filePath}`);
    }

    const rawData = fs.readFileSync(filePath);
    const teamsData = JSON.parse(rawData);

    let countCreated = 0, countUpdated = 0;

    for (const team of teamsData) {
      let existingTeam = await Team.findOne({ name: team.name });

      if (!existingTeam) {
        await Team.create(team);
        countCreated++;
      } else {
        existingTeam.country = team.country;
        existingTeam.coefficient = team.coefficient;
        await existingTeam.save();
        countUpdated++;
      }
    }

    console.log(`[Team Service] Imported ${countCreated} new teams, updated ${countUpdated}`);
    return { countCreated, countUpdated };
  } catch (error) {
    console.error("[Team Service] Error importing teams:", error);
    throw new Error("Error importing teams");
  }
};

/**
 * 📌 Récupère toutes les équipes triées par leur coefficient UEFA
 */
exports.getAllTeams = async () => {
  return Team.find().sort({ coefficient: -1 });
};
