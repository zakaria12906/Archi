// src/services/auth.service.js

const Account = require('../models/account.model');
const bcrypt = require('bcrypt');
const axios = require('axios');               // Pour appeler le Customers-Service (optionnel)
const { sendEmail } = require('./email.service'); 
const { generateRegistrationToken, verifyRegistrationToken } = require('../utils/token.util');
require('dotenv').config();

/**
 * 1) INSCRIPTION (Opt-in)
 *  - Vérifie que l'utilisateur (login) n'existe pas déjà
 *  - Crée le compte dans la DB Auth
 *  - (Optionnel) Crée le profil client (firstname, lastname) dans Customers-Service
 *  - Génère le token de double opt-in et envoie l'email
 */
exports.signup = async ({ login, password, firstname, lastname }) => {
  // (A) Vérifier si le compte existe déjà
  const existing = await Account.findOne({ login });
  if (existing) {
    throw new Error("Login already exists");
  }

  // (B) Créer le compte dans AuthDB (non activé)
  const hashedPassword = await bcrypt.hash(password, 10);
  const account = new Account({
    login,
    password: hashedPassword,
    isActivated: false
  });
  await account.save();

  // (C) Appeler le Customers-Service pour stocker firstname, lastname...
  //     On suppose que process.env.CUSTOMERS_SERVICE_URL est défini, ex: http://localhost:5002
  //     Si vous n'avez pas encore le Customers-Service lancé, commentez cette partie.
  try {
    await axios.post(`${process.env.CUSTOMERS_SERVICE_URL}/customers`, {
      accountId: account._id.toString(),
      firstname,
      lastname
    });
  } catch (error) {
    // S'il y a une erreur côté "Customers", vous pouvez:
    //  - Soit supprimer le compte Auth (pour éviter un compte en Auth sans profil),
    //  - Soit journaliser l'erreur et laisser le compte quand même.
    console.error("Error calling Customers-Service:", error.message);
    // Optionnel: rollback
    // await Account.findByIdAndDelete(account._id);
    // throw new Error("Could not create customer profile");
  }

  // (D) Générer un token d'activation (double opt-in)
  const registrationToken = generateRegistrationToken(account._id);

  // (E) Construire le lien vers l'endpoint GET /auth/double-opt-in?t=...
  const activationLink = `http://localhost:5001/auth/double-opt-in?t=${registrationToken}`;
  
  // (F) Envoyer l'email avec Nodemailer
  const subject = "Veuillez confirmer votre inscription (Double Opt-in)";
  const text = `Bonjour,

Merci de vous être inscrit(e) sur notre plateforme.

Veuillez cliquer sur ce lien pour valider votre compte :
${activationLink}

Cordialement,
L'équipe TRD Betting
`;

  // Envoi de l'email
  await sendEmail(login, subject, text);

  // (G) Retourner le compte créé
  return account;
};

/**
 * 2) VALIDATION (Double Opt-in)
 *  - Vérifie le token de double opt-in
 *  - Met isActivated = true sur le compte
 */
exports.activateAccount = async (registrationToken) => {
  // (A) Vérifier/extraire l'ID du compte depuis le token
  const accountId = await verifyRegistrationToken(registrationToken);
  if (!accountId) {
    throw new Error("Invalid or expired registration token");
  }

  // (B) Activer le compte en base
  const account = await Account.findById(accountId);
  if (!account) {
    throw new Error("Account not found");
  }
  if (account.isActivated) {
    // Si le compte est déjà activé, on peut décider de renvoyer un message particulier
    // ou simplement ignorer.
    return account;
  }

  account.isActivated = true;
  await account.save();

  // (C) (Optionnel) Envoyer un email de confirmation "Votre compte est maintenant activé"
  // ou publier un événement "customer_registered" si vous avez un Notification-Service.

  return account;
};

/**
 * 3) CONNEXION (Login)
 *  - Vérifier que le compte existe
 *  - Vérifier le password (bcrypt)
 *  - Optionnel: Vérifier isActivated pour bloquer la connexion tant que l'utilisateur n'a pas validé son compte.
 *  - Générer un token JWT d'authentification (différent du token double opt-in)
 */
exports.login = async (login, password) => {
  // (A) Chercher le compte
  const account = await Account.findOne({ login });
  if (!account) {
    throw new Error("Account not found");
  }

  // (B) Vérifier le mot de passe
  const match = await bcrypt.compare(password, account.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  // (C) Vérifier l'activation du compte si besoin
  if (!account.isActivated) {
    throw new Error("Account not activated. Please confirm your email.");
  }

  // (D) Générer un token JWT normal pour la session (différent du token double opt-in)
  const jwt = require('jsonwebtoken');
  const authToken = jwt.sign(
    { accountId: account._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // (E) Retourner le token d'auth
  return authToken;
};
