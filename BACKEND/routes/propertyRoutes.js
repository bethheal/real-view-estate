import express from "express";
import { verifyToken, permit } from "../middleware/authMiddleware.js";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getProperties);
router.get("/:id", getProperty);

router.post(
  "/",
  verifyToken,
  permit("AGENT"),
  upload.array("images", 5),
  createProperty
);

router.patch("/:id", verifyToken, permit("AGENT"), updateProperty);
router.delete("/:id", verifyToken, permit("AGENT"), deleteProperty);

export default router;
