import express from "express";
import dotenv from "dotenv";
import cors from "cors";                 // ✅ Add this
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { PrismaClient } from "@prisma/client";
import passport from "passport";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://realeastateview.netlify.app"
];

// Apply CORS to all routes
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true); // Postman, mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], // include OPTIONS
    credentials: true,
  })
);

// Handle OPTIONS preflight requests for all routes
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  credentials: true
}));



app.use(express.json());
app.use(passport.initialize());

const prisma = new PrismaClient();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("server is running");
});

//Connect Database
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
  console.log(`Server is running on port ${PORT}`);
});
