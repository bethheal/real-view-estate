import express from "express";
import { verifyToken, permit } from "../middleware/authMiddleware.js";
import { getLeads, createLead } from "../controllers/leadController.js";

const router = express.Router();

router.get("/", verifyToken, permit("ADMIN", "AGENT"), getLeads);
router.post("/", createLead);

export default router;
