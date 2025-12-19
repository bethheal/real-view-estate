import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET leads (admin sees all, agent sees theirs)
export const getLeads = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const whereClause = req.user?.roles.includes("ADMIN")
    ? {}
    : { property: { agentId: req.user.agentId } };

  try {
    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: { property: true },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.lead.count({ where: whereClause });

    res.json({ data: leads, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};

// POST new lead
export const createLead = async (req, res) => {
  const { name, email, phone, message, propertyId } = req.body;
  try {
    const lead = await prisma.lead.create({
      data: { name, email, phone, message, propertyId },
    });
    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create lead" });
  }
};
