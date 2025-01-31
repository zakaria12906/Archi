require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const betRoutes = require('./routes/bet.routes');
const { connectMQ } = require('./services/mq.service');
const { startScheduler } = require('./services/scheduler.service');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Définition des routes
app.use('/bets', betRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, async () => {
  console.log(`✅ Bet-Service running on port ${PORT}`);
  await connectMQ();
  startScheduler();
});
