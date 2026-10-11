const mongoose = require("mongoose");

let connecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (!connecting) {
    connecting = mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected");
    });
  }
  try {
    await connecting;
  } catch (err) {
    connecting = null;
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;