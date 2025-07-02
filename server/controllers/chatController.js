const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const Memory = require("../models/Memory");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat — Chat with AI
exports.chatWithAgent = async (req, res) => {
  const { userId, message } = req.body;

  if (!message || !userId) {
    return res.status(400).json({
      success: false,
      error: "userId and message are required",
    });
  }

  console.log("✅ Gemini key used:", process.env.GEMINI_API_KEY);
  console.log("🧠 User message:", message);

  let reply = "I'm currently unavailable. Please try again later.";

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash", // ✅ Gemini model
    });

    const result = await model.generateContent(message);
    reply = result.response.text() || reply;
  } catch (genErr) {
    console.error("❌ Gemini API Error:", genErr.message || genErr);
  }

  try {
    // Save user message
    await Memory.create({ userId, role: "user", message });

    // Save agent reply
    await Memory.create({ userId, role: "agent", message: reply });

    return res.json({ success: true, reply });
  } catch (dbErr) {
    console.error("❌ DB Save Error:", dbErr.message || dbErr);
    return res.status(500).json({ success: false, error: "Database error" });
  }
};

// GET /api/chat/:userId — Fetch chat history
exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "User ID required",
    });
  }

  try {
    const messages = await Memory.find({ userId }).sort({ timestamp: 1 });
    return res.json({ success: true, messages });
  } catch (err) {
    console.error("❌ Chat History Error:", err.message || err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch chat history" });
  }
};
