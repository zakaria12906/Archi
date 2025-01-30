require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth.routes');
//const { connectRabbitMQ } = require('./services/mq.service');

const app = express();
app.use(cors());
app.use(express.json());


// Monte les routes de AuthController sur le chemin /auth
app.use('/auth', authRoutes);

// Connection MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("AuthDB connected"))
  .catch(err => console.error("AuthDB connection error:", err));

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`Auth-Service running on port ${PORT}`);

  // Connexion RabbitMQ
  //await connectRabbitMQ();
});
