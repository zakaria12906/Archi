// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');

exports.signup = async (req, res) => {
  try {
    // On récupère du body déjà validé par Joi (cf. validate.middleware.js) 
    const { login, password, firstname, lastname, role } = req.body;
    const account = await AuthService.signup({ login, password, firstname, lastname, role });
    res.status(201).json({
      message: "User created (Opt-in email sent)",
      accountId: account._id
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ error: err.message || "Unknown error" });
  }
};

exports.doubleOptIn = async (req, res) => {
  try {
    const { t } = req.query; // token d'activation
    const account = await AuthService.activateAccount(t);
    res.status(200).json({
      message: "Account activated",
      accountId: account._id
    });
  } catch (err) {
    console.error("Double Opt-in error:", err);
    res.status(400).json({ error: err.message || "Unknown error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    // Retournons un accessToken + refreshToken
    const { accessToken, refreshToken } = await AuthService.login(login, password);
    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({ error: err.message || "Login failed" });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const newTokens = await AuthService.refresh(refreshToken);
    // newTokens = { accessToken, refreshToken (optionnel) }
    res.status(200).json(newTokens);
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(401).json({ error: err.message || "Refresh failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { login } = req.body;
    await AuthService.forgotPassword(login);
    res.status(200).json({
      message: "A reset link has been sent to your email (if account exists)"
    });
  } catch (err) {
    console.error("Forgot Password error:", err);
    res.status(400).json({ error: err.message || "Unknown error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body; 
    await AuthService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset Password error:", err);
    res.status(400).json({ error: err.message || "Unknown error" });
  }
};
