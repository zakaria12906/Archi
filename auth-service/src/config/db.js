const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI); // Debug: Affiche l'URI
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ AuthDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
