// src/services/email.service.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // Ici, on configure le transporteur Nodemailer avec un compte Gmail
    // Renseignez bien vos variables d'environnement dans .env
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Votre email
        pass: process.env.EMAIL_PASS  // Un "App Password" si l’auth 2FA est activée
      }
    });

    await transporter.sendMail({
      from: `"NomDeVotreApp" <${process.env.EMAIL_USER}>`, 
      to,
      subject,
      text
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email.");
  }
};

module.exports = { sendEmail };
