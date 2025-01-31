// src/config/db.js
const mongoose = require('mongoose');


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(" BetDB connected");
  } catch (err) {
    console.error(" BetDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
