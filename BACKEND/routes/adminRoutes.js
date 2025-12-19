import express from "express";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
const router = express.Router();

router.get("/analytics", verifyToken, requireAdmin, getAdminAnalytics);
router.get("/dashboard", verifyToken, requireAdmin, getAdminAnalytics);
router.get("/dashboard/stats", verifyToken, getDashboardStats);
export default router;
