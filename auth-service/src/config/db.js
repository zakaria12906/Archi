// src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("AuthDB connected");
  } catch (err) {
    console.error("AuthDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
