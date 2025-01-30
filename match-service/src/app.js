require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const matchRoutes = require('./routes/match.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la DB
connectDB();

// Routes
app.use('/matches', matchRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Match-Service running on port ${PORT}`);
});
