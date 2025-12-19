import prisma from "../src/utils/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const properties = await prisma.property.count();
    const leads = await prisma.lead.count();
    const users = await prisma.user.count();

    res.json({
      properties,
      leads,
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
