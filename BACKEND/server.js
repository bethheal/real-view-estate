import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Needed for dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------ CORS (LOCAL ONLY) ----------------
const isLocal = process.env.NODE_ENV === "development";

if (isLocal) {
  console.log("🟡 Running in LOCAL mode — enabling CORS");
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );
} else {
  console.log("🟢 PRODUCTION mode — CORS disabled");
}
// ------------------------------------------------

// Body parser + passport
app.use(express.json());
app.use(passport.initialize());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);

// ------------ SERVE FRONTEND IN PRODUCTION ----------------
if (!isLocal) {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));

  app.get("/*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

}
// -----------------------------------------------------------

// Connect Database
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
