// src/models/match.model.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teams: {
    home: { type: String, required: true },
    away: { type: String, required: true }
  },
  date: { type: Date, required: true },
  odds: {
    homeWin: { type: Number, required: true },
    draw: { type: Number, required: true },
    awayWin: { type: Number, required: true }
  },
  oddsHistory: [
    {
      updatedAt: { type: Date, default: Date.now },
      oddsSnapshot: {
        homeWin: Number,
        draw: Number,
        awayWin: Number
      }
    }
  ],
  status: {
    type: String,
    enum: ["upcoming", "in_progress", "finished"],
    default: "upcoming"
  },
  score: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },
  createdBy: {
    type: String, // ID du bookmaker qui a créé le match
    required: true
  }
});

module.exports = mongoose.model('Match', matchSchema);
