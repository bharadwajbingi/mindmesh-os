// server/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const {
  chatWithAgent,
  getChatHistory,
} = require("../controllers/chatController");

router.post("/chat", chatWithAgent);
router.get("/:userId", getChatHistory);
module.exports = router;
