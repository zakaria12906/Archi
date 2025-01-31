// src/models/team.model.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  coefficient: { type: Number, required: true }
});

module.exports = mongoose.model('Team', teamSchema);
