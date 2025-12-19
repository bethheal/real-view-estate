import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Multer setup for local temp storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// GET properties with pagination & search
export const getProperties = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const skip = (page - 1) * limit;

  try {
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      },
      include: { agent: true, leads: true },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.property.count({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    res.json({ data: properties, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// GET single property
export const getProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { agent: true, leads: true },
    });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

// POST new property with images
export const createProperty = async (req, res) => {
  const { title, description, price, location } = req.body;
  const agentId = req.user?.agentId;

  if (!agentId) return res.status(403).json({ message: "Only agents can add properties" });

  try {
    const uploadedImages = [];
    for (const file of req.files) {
      const uploaded = await cloudinary.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) throw error;
        uploadedImages.push(result.secure_url);
      }).end(file.buffer);
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        images: uploadedImages,
        agentId,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create property" });
  }
};

// PATCH property
export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location } = req.body;

  try {
    const property = await prisma.property.update({
      where: { id },
      data: { title, description, price: parseFloat(price), location },
    });
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update property" });
  }
};

// DELETE property
export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.property.delete({ where: { id } });
    res.json({ message: "Property deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete property" });
  }
};
