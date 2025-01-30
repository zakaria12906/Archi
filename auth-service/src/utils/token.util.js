// src/utils/token.util.js
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Génère un token JWT d'activation
exports.generateRegistrationToken = (accountId) => {
  // vous pouvez générer un payload custom
  return jwt.sign(
    { accountId, tokenId: uuidv4() },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }  // 24h pour activer le compte
  );
};

// Vérifie et renvoie l'accountId
exports.verifyRegistrationToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.accountId; 
  } catch (e) {
    return null;
  }
};
