// src/models/match.model.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  teams: {
    home: { type: String, required: true },
    away: { type: String, required: true }
  },
  date: {
    type: Date,
    required: true
  },
  odds: {
    type: Map,
    of: Number,
    default: {}
    // ex: { homeWin: 1.8, draw: 3.2, awayWin: 2.1 }
  },
  status: {
    type: String,
    enum: ["upcoming", "in_progress", "finished"],
    default: "upcoming"
  },
  score: {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 }
  },
  // Pour mettre en avant un match (promos, highlight, etc.)
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', matchSchema);
