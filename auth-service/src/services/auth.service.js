// src/services/auth.service.js

const Account = require('../models/account.model');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { 
  generateRegistrationToken, 
  verifyRegistrationToken,
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken
} = require('../utils/token.util');
const { sendEmail } = require('./email.service');
const crypto = require('crypto');

// 1) SIGNUP
exports.signup = async ({ login, password, firstname, lastname, role }) => {
  // Vérifier si le compte existe déjà
  const existing = await Account.findOne({ login });
  if (existing) {
    throw new Error("Login already exists");
  }

  // Créer le compte (non activé)
  const hashedPassword = await bcrypt.hash(password, 10);
  const account = new Account({
    login,
    password: hashedPassword,
    isActivated: false,
    role: role || 'parieur' 
  });
  await account.save();

  // Optionnel : Appel au Customers-Service pour firstname, lastname...
  if (process.env.CUSTOMERS_SERVICE_URL) {
    try {
      await axios.post(`${process.env.CUSTOMERS_SERVICE_URL}/customers`, {
        accountId: account._id.toString(),
        firstname,
        lastname
      });
    } catch (err) {
      console.error("Error calling Customers-Service:", err.message);
      // Vous pourriez faire un rollback si nécessaire
    }
  }

  // Générer token double opt-in
  const registrationToken = generateRegistrationToken(account._id);
  const activationLink = `http://localhost:5001/auth/double-opt-in?t=${registrationToken}`;

  // Envoyer un email avec Nodemailer
  const subject = "Veuillez confirmer votre inscription (Double Opt-in)";
  const text = `Bonjour,

Merci de vous être inscrit(e).
Cliquez sur ce lien pour valider votre compte :
${activationLink}

Cordialement,
L'équipe TRD
`;
  await sendEmail(login, subject, text);

  return account;
};

// 2) ACTIVER LE COMPTE (double opt-in)
exports.activateAccount = async (registrationToken) => {
  const accountId = verifyRegistrationToken(registrationToken);
  if (!accountId) {
    throw new Error("Invalid or expired activation token");
  }
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error("Account not found");
  }
  if (account.isActivated) {
    // déjà activé
    return account;
  }
  account.isActivated = true;
  await account.save();
  return account;
};

// 3) LOGIN
//    - Vérifier le password
//    - Vérifier isActivated
//    - Générer un accessToken + refreshToken
exports.login = async (login, password) => {
  const account = await Account.findOne({ login });
  if (!account) {
    throw new Error("Account not found");
  }
  // Vérif mot de passe
  const match = await bcrypt.compare(password, account.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }
  if (!account.isActivated) {
    throw new Error("Account not activated. Please confirm your email.");
  }

  // Générer tokens
  const accessToken = generateAccessToken(account._id, account.role);
  const refreshToken = generateRefreshToken(account._id);

  // Stocker refreshToken dans la DB (au besoin, pour invalider plus tard)
  account.refreshToken = refreshToken;
  await account.save();

  return { accessToken, refreshToken };
};

// 4) REFRESH
//    - Vérifier que le refreshToken est valide et correspond à l'user
//    - Générer un nouveau accessToken, et éventuellement un nouveau refreshToken
exports.refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  // Décoder le refreshToken
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new Error("Invalid or expired refresh token");
  }

  // Retrouver le compte en base
  const account = await Account.findById(payload.accountId);
  if (!account) {
    throw new Error("Account not found");
  }
  if (account.refreshToken !== refreshToken) {
    throw new Error("Refresh token mismatch");
  }

  // Générer un nouveau accessToken (et / ou refreshToken)
  const newAccessToken = generateAccessToken(account._id, account.role);
  // On peut redonner le même refreshToken ou en générer un nouveau
  // Ici on montre comment régénérer :
  const newRefreshToken = generateRefreshToken(account._id);

  // Stocker le nouveau refreshToken
  account.refreshToken = newRefreshToken;
  await account.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// 5) FORGOT PASSWORD
//    - Générer un token random
//    - Stocker resetToken et resetTokenExpires dans la DB
//    - Envoyer un email avec un lien
exports.forgotPassword = async (login) => {
  const account = await Account.findOne({ login });
  if (!account) {
    // Par discrétion, on ne dit pas "account not found", 
    // on envoie un message "mail envoyé" même si ça n'existe pas
    return;
  }

  // Générer un token aléatoire
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  account.resetToken = resetToken;
  account.resetTokenExpires = expires;
  await account.save();

  const resetLink = `http://localhost:5001/auth/reset-password?token=${resetToken}`;

  const subject = "Réinitialisation de mot de passe";
  const text = `Bonjour,

Vous (ou quelqu'un) avez demandé à réinitialiser le mot de passe de votre compte.
Cliquez sur ce lien pour définir un nouveau mot de passe :
${resetLink}

Ce lien expire dans 30 minutes.

Cordialement,
L'équipe TRD
`;

  await sendEmail(account.login, subject, text);
};

// 6) RESET PASSWORD
//    - Vérifier le resetToken
//    - Comparer la date d'expiration
//    - Mettre à jour le mot de passe
exports.resetPassword = async (token, newPassword) => {
  const account = await Account.findOne({ resetToken: token });
  if (!account) {
    throw new Error("Invalid reset token");
  }
  if (!account.resetTokenExpires || account.resetTokenExpires < Date.now()) {
    throw new Error("Reset token has expired");
  }

  // Hacher le nouveau mot de passe
  const hashed = await bcrypt.hash(newPassword, 10);
  account.password = hashed;
  // Supprimer le resetToken
  account.resetToken = null;
  account.resetTokenExpires = null;

  await account.save();
};
