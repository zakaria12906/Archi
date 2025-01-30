// src/controllers/auth.controller.js

const AuthService = require('../services/auth.service');

/**
 * 1) Inscription (Opt-in)
 *    - Récupère login, password, firstname, lastname du body
 *    - Appelle AuthService.signup()
 *    - Retourne un message + l'id du compte
 */
exports.signup = async (req, res) => {
  try {
    const { login, password, firstname, lastname } = req.body;

    // Appel à la logique métier
    const account = await AuthService.signup({ 
      login, 
      password, 
      firstname, 
      lastname 
    });

    return res.status(201).json({
      message: "User created successfully (Opt-in email sent)",
      accountId: account._id
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(400).json({ error: err.message || "Unknown error" });
  }
};

/**
 * 2) Double Opt-in
 *    - Récupère le token (t) depuis la query string
 *    - Appelle AuthService.activateAccount() pour valider
 *    - Retourne un message + l'id du compte
 */
exports.doubleOptIn = async (req, res) => {
  try {
    const { t } = req.query; // le token transmis en GET ?t=...

    // Activation du compte
    const account = await AuthService.activateAccount(t);

    return res.status(200).json({
      message: "Account activated",
      accountId: account._id
    });
  } catch (err) {
    console.error("Double Opt-in error:", err);
    return res.status(400).json({ error: err.message || "Unknown error" });
  }
};

/**
 * 3) Connexion
 *    - Récupère login, password depuis le body
 *    - Appelle AuthService.login()
 *    - Retourne le token JWT d'authentification
 */
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const token = await AuthService.login(login, password);

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ error: err.message || "Login failed" });
  }
};
