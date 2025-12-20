
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// ------------ CORS CONFIG ----------------
app.use(cors({
  origin: ["http://localhost:5173", "https://real-view-estate.onrender.com"],
  credentials: true
}));

// ------------ BODY PARSER ----------------
app.use(express.json());

// ------------ API ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/admin", adminRoutes);

// ------------ DATABASE CONNECTION ----------------
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}
connectDB();

// ------------ SERVE REACT FRONTEND ----------------
// Change "../frontend/dist" to your React build folder path
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route for React Router
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ------------ START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
