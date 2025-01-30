require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import des routes
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
connectDB();

// Routes
app.use('/auth', authRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth-Service running on port ${PORT}`);
});
