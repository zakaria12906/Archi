// src/services/mq.service.js
const amqp = require('amqplib');
let channel = null;

exports.connectRabbitMQ = async () => {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    console.log("Auth-Service connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
  }
};

exports.publishMessage = async (routingKey, message) => {
  if (!channel) {
    console.error("RabbitMQ channel not initialized");
    return;
  }
  try {
    // Vous pouvez utiliser un exchange direct, topic, etc.
    const exchangeName = 'trd_exchange';
    await channel.assertExchange(exchangeName, 'topic', { durable: false });
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
    console.log(`[AuthService] Published message to ${routingKey}`, message);
  } catch (err) {
    console.error("publishMessage error:", err);
  }
};
