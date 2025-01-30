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
  role: {
    type: String,
    default: 'parieur' // ou "user" par défaut
  },
  refreshToken: {
    type: String
    // On peut stocker le dernier refreshToken, ou un tableau si on veut gérer multi-devices
  },
  resetToken: {
    type: String
    // Utilisé pour le reset de mot de passe
  },
  resetTokenExpires: {
    type: Date
    // Date d'expiration du reset token
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // + d'autres champs si besoin (date de dernière connexion, etc.)
});

module.exports = mongoose.model('Account', accountSchema);
