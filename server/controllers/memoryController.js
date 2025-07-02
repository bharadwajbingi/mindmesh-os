// server/controllers/memoryController.js
const Memory = require("../models/Memory");

exports.saveMessage = async (req, res) => {
  try {
    const { userId, role, message } = req.body;
    const memory = new Memory({ userId, role, message });
    await memory.save();
    res.status(201).json({ success: true, memory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Memory.find({ userId }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
