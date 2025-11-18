import express from "express";
import passport from "passport"; 
import jwt from "jsonwebtoken"; 
import { login, signup } from "../controllers/authController.js";
import { forgotPassword, resetPassword } from "../controllers/passwordControllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login)


//Google Auth Route (Optional)
// router.post("/signup", signup);
// router.post("/login", login);

//forgot password and reset password routes can be added here
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// Google OAuth
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