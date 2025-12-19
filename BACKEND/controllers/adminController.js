// controllers/adminController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalAgents = await prisma.user.count({ where: { role: "AGENT" } });
    const totalBuyers = await prisma.user.count({ where: { role: "BUYER" } });
    const totalProperties = await prisma.property.count();
    const totalLeads = await prisma.lead.count();

    res.json({
      totalUsers,
      totalAgents,
      totalBuyers,
      totalProperties,
      totalLeads,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
