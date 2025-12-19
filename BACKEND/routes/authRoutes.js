import express from "express";
import passport from "passport"; 
import jwt from "jsonwebtoken"; 
import { adminLogin, login, signup } from "../controllers/authController.js";
import { forgotPassword, resetPassword } from "../controllers/passwordController.js";

const router = express.Router();

// Auth endpoints
router.post("/signup", signup);
router.post("/login", login);
router.post("/admin/login", adminLogin);

// Password reset endpoints
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth (optional)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ message: "Login successful", token, role: req.user.role });
  }
);

export default router;
