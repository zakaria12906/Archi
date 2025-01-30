// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customer.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la DB
connectDB();

// Routes
app.use('/customers', customerRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Customers-Service running on port ${PORT}`);
});
