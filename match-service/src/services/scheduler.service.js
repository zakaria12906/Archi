// src/services/scheduler.service.js
const cron = require('node-cron');
const Match = require('../models/match.model');
const { publishEvent } = require('./mq.service');

/**
 * 📌 Lance plusieurs jobs planifiés (cron) :
 * ✅ 1) Passer les matchs "upcoming" à "in_progress" lorsque la date est atteinte.
 * ✅ 2) Passer les matchs "in_progress" à "finished" après 90 minutes.
 */
exports.startScheduler = () => {
  // Toutes les minutes, on vérifie l'état des matchs
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // 📌 Passer les matchs "upcoming" à "in_progress"
      const upcomingMatches = await Match.find({ status: "upcoming", date: { $lte: now } });
      for (const match of upcomingMatches) {
        match.status = "in_progress";
        await match.save();
        console.log(`[Scheduler] Match commencé : ${match.teams.home} vs ${match.teams.away}`);
        await publishEvent('match_started', { matchId: match._id });
      }

      // 📌 Passer les matchs "in_progress" à "finished" après 90 minutes
      const finishedMatches = await Match.find({ status: "in_progress", date: { $lte: new Date(now - 90 * 60000) } });
      for (const match of finishedMatches) {
        match.status = "finished";
        await match.save();
        console.log(`[Scheduler] Match terminé : ${match.teams.home} vs ${match.teams.away}`);
        await publishEvent('match_finished', { matchId: match._id });
      }
    } catch (err) {
      console.error("[Scheduler] Erreur :", err);
    }
  });
};
