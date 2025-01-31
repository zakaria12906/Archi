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
    req.user = decoded; // { accountId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

/**
 * 📌 Vérifie si l’utilisateur est un bookmaker ou un admin
 */
exports.isBookmaker = (req, res, next) => {
  if (req.user.role !== "bookmaker" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès interdit : réservé aux bookmakers et admins" });
  }
  next();
};
