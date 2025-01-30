// src/routes/auth.routes.js

const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

// POST /auth/signup -> Crée un compte (Opt-in) et envoie un email
router.post('/signup', AuthController.signup);

// GET /auth/double-opt-in -> Valide le compte via un token (Double Opt-in)
router.get('/double-opt-in', AuthController.doubleOptIn);

// POST /auth/login -> Connexion (retourne un token JWT)
router.post('/login', AuthController.login);

module.exports = router;
