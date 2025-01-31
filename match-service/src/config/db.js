const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MatchDB connected");
  } catch (err) {
    console.error("MatchDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
