const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from server .env (or fallback to root .env)
dotenv.config({ path: path.join(__dirname, ".env") });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
}

const connectDB = require("./config/db.js");
const { seedAdminUser } = require("./config/seedAdmin.js");
const adminRoutes = require("./routes/adminRoutes.js");
const studentRoutes = require("./routes/studentRoutes.js");

const app = express();
const PORT = process.env.PORT || 5075;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes); // Also support direct route

app.use("/api/students", studentRoutes);
app.use("/students", studentRoutes); // Also support direct route

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "School Management System API",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("School Management System Backend API is running.");
});

// Start server and connect to database
const startServer = async () => {
  try {
    await connectDB();
    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(`[Server] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[Server] Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

