// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

// Vérifier qu'on a un token JWT valide
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { accountId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Vérifier que l'utilisateur est bookmaker ou admin
exports.isBookmakerOrAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'bookmaker' && role !== 'admin') {
    return res.status(403).json({ error: "Forbidden: Bookmaker or Admin role required" });
  }
  next();
};
