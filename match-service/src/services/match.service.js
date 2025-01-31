// src/services/match.service.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Match = require('../models/match.model');
const Team = require('../models/team.model');
const { publishEvent } = require('./mq.service');

/**
 * 📥 Importe les matchs depuis un fichier CSV stocké dans `data/`
 */
exports.importMatchesFromCSV = async () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../../data/matches.csv');

    if (!fs.existsSync(filePath)) {
      return reject(new Error(`Fichier introuvable : ${filePath}`));
    }

    let matches = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        const homeTeam = await Team.findOne({ name: row["Home Team"] });
        const awayTeam = await Team.findOne({ name: row["Away Team"] });

        if (homeTeam && awayTeam) {
          matches.push({
            teams: { home: homeTeam.name, away: awayTeam.name },
            date: new Date(row["Date"]),
            odds: {
              homeWin: parseFloat(row["Odds Home"]),
              draw: parseFloat(row["Odds Draw"]),
              awayWin: parseFloat(row["Odds Away"])
            },
            status: "upcoming"
          });
        }
      })
      .on('end', async () => {
        let countCreated = 0;
        for (const matchData of matches) {
          const existingMatch = await Match.findOne({
            "teams.home": matchData.teams.home,
            "teams.away": matchData.teams.away,
            "date": matchData.date
          });

          if (!existingMatch) {
            await Match.create(matchData);
            countCreated++;
          }
        }
        console.log(`[Match Service] Imported ${countCreated} matches`);
        resolve({ countCreated });
      })
      .on('error', (err) => reject(err));
  });
};

/**
 * 📌 Création d’un match (Réservé aux bookmakers)
 */
exports.createMatch = async (matchData) => {
  const homeTeam = await Team.findOne({ name: matchData.teams.home });
  const awayTeam = await Team.findOne({ name: matchData.teams.away });

  if (!homeTeam || !awayTeam) {
    throw new Error("L'une des équipes n'existe pas");
  }

  const match = new Match({
    teams: matchData.teams,
    date: matchData.date,
    odds: matchData.odds,
    status: "upcoming",
    createdBy: matchData.createdBy
  });

  await match.save();
  return match;
};

/**
 * 📌 Récupération de tous les matchs
 */
exports.getAllMatches = async () => {
  return Match.find().sort({ date: 1 });
};

/**
 * 📌 Mettre à jour les cotes d’un match
 */
exports.updateOdds = async (matchId, newOdds) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match introuvable");

  // Historique des cotes
  match.oddsHistory.push({
    updatedAt: new Date(),
    oddsSnapshot: match.odds
  });

  // Mise à jour des cotes
  match.odds = newOdds;
  
  await match.save();
  return match;
};

/**
 * 📌 Mettre à jour le statut d’un match (upcoming → in_progress → finished)
 */
exports.updateMatchStatus = async (matchId, newStatus) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error("Match introuvable");

  match.status = newStatus;
  await match.save();

  // Publier un événement en fonction du nouveau statut
  if (newStatus === "in_progress") {
    await publishEvent('match_started', { matchId: match._id });
  }
  if (newStatus === "finished") {
    await publishEvent('match_finished', { matchId: match._id });
  }

  return match;
};
