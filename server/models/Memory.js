// server/models/Memory.js
const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, enum: ["user", "agent"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Memory", memorySchema);
