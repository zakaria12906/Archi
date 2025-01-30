// src/models/account.model.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Optionnel: refresh_token, lastConnection, etc.
});

module.exports = mongoose.model('Account', accountSchema);
