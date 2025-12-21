import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

/* ---------------- GET ALL PROPERTIES ---------------- */
export const getProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      data: properties,
      total: properties.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

/* ---------------- GET SINGLE PROPERTY ---------------- */
export const getProperty = async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

/* ---------------- CREATE PROPERTY ---------------- */
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    const agentId = req.user.id;

    if (!title || !price || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ CORRECT Cloudinary upload
    const imageUrls = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "properties" },
              (err, result) => {
                if (err) reject(err);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
      )
    );

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        images: imageUrls,
        agentId,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create property" });
  }
};

/* ---------------- UPDATE PROPERTY ---------------- */
export const updateProperty = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    const property = await prisma.property.updateMany({
      where: {
        id: req.params.id,
        agentId: req.user.id,
      },
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
      },
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Failed to update property" });
  }
};

/* ---------------- DELETE PROPERTY ---------------- */
export const deleteProperty = async (req, res) => {
  try {
    await prisma.property.deleteMany({
      where: {
        id: req.params.id,
        agentId: req.user.id,
      },
    });

    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};
