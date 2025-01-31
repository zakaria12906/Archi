// src/models/bet.model.js
const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: {
    type: String,
    enum: ["simple", "combiné"],
    required: true
  },
  bets: [
    {
      matchId: { type: mongoose.Schema.Types.ObjectId, required: true },
      betType: { type: String, enum: ["homeWin", "draw", "awayWin"], required: true },
      odd: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },
  potentialGain: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "won", "lost", "paid"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bet", betSchema);
