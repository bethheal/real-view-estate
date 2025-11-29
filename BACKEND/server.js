import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();

// ------------ CORS CONFIG (Local Only) ----------------
// ------------ CORS CONFIG (Local Only) ----------------

app.use(cors({
  origin: ["http://localhost:5173", "https://real-view-estate.onrender.com"],
  credentials: true
}));




// ------------ BODY PARSER ----------------
app.use(express.json());

// ------------ API ROUTES ----------------
app.get("/", (req, res) => {
  res.send("API is running on Render!");
});

app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);

// ------------ DATABASE CONNECTION ----------------
const prisma = new PrismaClient();

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

// ------------ START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
