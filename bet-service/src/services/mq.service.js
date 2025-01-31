// src/services/mq.service.js
const amqp = require('amqplib');

let channel = null;
const EXCHANGE_NAME = 'trd_exchange';

/**
 * 📌 Connexion à RabbitMQ
 */
exports.connectMQ = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: false });
    console.log("✅ [Bet-Service] Connecté à RabbitMQ");
  } catch (err) {
    console.error("❌ Erreur de connexion à RabbitMQ:", err);
  }
};

/**
 * 📌 Publier un événement RabbitMQ
 * @param {string} routingKey - Clé de routage (ex: "bet_placed", "payment_success")
 * @param {Object} message - Contenu du message
 */
exports.publishEvent = async (routingKey, message) => {
  if (!channel) {
    console.error(" RabbitMQ non connecté : impossible d'envoyer l'événement");
    return;
  }
  
  try {
    const payload = Buffer.from(JSON.stringify(message));
    channel.publish(EXCHANGE_NAME, routingKey, payload);
    console.log(`📢 [Bet-Service] Événement publié : ${routingKey}`, message);
  } catch (err) {
    console.error(" Erreur lors de la publication de l'événement:", err);
  }
};
