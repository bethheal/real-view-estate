import prisma from "../utils/prisma.js";

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        agent: true,
        buyer: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Profile fetch failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: req.body
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};
