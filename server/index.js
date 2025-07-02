const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const memoryRoutes = require("./routes/memoryRoutes"); // ✅ Memory routes
const chatRoutes = require("./routes/chatRoutes"); // ✅ Chat routes

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api", memoryRoutes);
app.use("/api", chatRoutes); // 👈 You forgot to use "/api/chat" here

app.get("/", (req, res) => {
  res.send("🧠 MindMesh OS Backend Running!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
