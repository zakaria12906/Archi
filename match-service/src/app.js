require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const matchRoutes = require('./routes/match.routes');
const teamRoutes = require('./routes/team.routes');
const { connectMQ } = require('./services/mq.service');
const { startScheduler } = require('./services/scheduler.service');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/matches', matchRoutes);
app.use('/teams', teamRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, async () => {
  console.log(`Match-Service running on port ${PORT}`);
  await connectMQ();
  startScheduler();
});
