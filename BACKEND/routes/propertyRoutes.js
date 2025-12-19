import express from "express";
import { verifyToken, permit } from "../middleware/authMiddleware.js";
import {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty, upload
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", verifyToken, permit("AGENT"), upload.array("images", 5), createProperty);
router.patch("/:id", verifyToken, permit("AGENT"), updateProperty);
router.delete("/:id", verifyToken, permit("AGENT"), deleteProperty);

export default router;
