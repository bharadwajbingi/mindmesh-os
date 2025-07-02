// ✅ Corrected version: server/routes/memoryRoutes.js

const express = require("express");
const router = express.Router();
const { saveMessage, getMessages } = require("../controllers/memoryController");

router.post("/", saveMessage); // becomes POST /api/memory
router.get("/:userId", getMessages); // becomes GET /api/memory/:userId

module.exports = router;
