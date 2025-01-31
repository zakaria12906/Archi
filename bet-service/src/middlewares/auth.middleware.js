// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

/**
 * 📌 Vérifie que l’utilisateur est bien authentifié
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Aucun token fourni" });
  }
  
  const token = authHeader.split(' ')[1]; // Format "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};
