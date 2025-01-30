// src/utils/token.util.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/**
 * Génère un token JWT d'activation (double opt-in)
 */
exports.generateRegistrationToken = (accountId) => {
  return jwt.sign(
    { accountId, tokenId: uuidv4() },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }  // 1 jour
  );
};

exports.verifyRegistrationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.accountId;
  } catch (e) {
    return null;
  }
};

/**
 * Génère un AccessToken (JWT) avec une durée plus courte (ex. 15 minutes / 1h)
 */
exports.generateAccessToken = (accountId, role) => {
  return jwt.sign(
    { accountId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // ex. 15 min
  );
};

/**
 * Génère un RefreshToken (JWT) avec une durée plus longue (ex. 7 jours)
 */
exports.generateRefreshToken = (accountId) => {
  return jwt.sign(
    { accountId, tokenId: uuidv4() },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' } 
  );
};

/**
 * Vérifie le RefreshToken
 */
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET);
  } catch (e) {
    return null;
  }
};
