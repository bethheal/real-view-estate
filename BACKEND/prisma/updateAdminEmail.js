// scripts/updateAdminEmail.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateEmail() {
  const admin = await prisma.user.update({
    where: {
      email: "admin@admincom",
    },
    data: {
      email: "admin@admin.com",
    },
  });

  console.log("✅ Admin email updated:", admin.email);
}

updateEmail()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
