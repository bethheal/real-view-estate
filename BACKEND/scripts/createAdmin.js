// scripts/createAdmin.js
// Run this script with: npm run create-admin

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

const createAdmin = async () => {
  try {
    console.log("🔄 Connecting to database...");

    // ════════════════════════════════════════════════════════
    // ⚠️  CHANGE THESE ADMIN CREDENTIALS BEFORE RUNNING  ⚠️
    // ════════════════════════════════════════════════════════
    const adminData = {
      name: " Admin",              // Admin's full name
      email: "admin@admin.com",    // Admin's email (must be unique)
      phone: "0554345443",             // Admin's phone number
      password: "Admin@2025",            // Admin's password (plain text - will be hashed)
      role: "ADMIN",                   // User role - must be ADMIN
    };

    console.log(`\n📧 Checking if admin exists: ${adminData.email}`);

    // Check if an admin with this email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log("\n⚠️  Admin already exists with that email.");
      console.log("💡 Tip: Change the email in adminData and try again, or delete the existing user.");
      await prisma.$disconnect();
      process.exit(0);
    }

    console.log("🔐 Hashing password...");

    // Hash the password before storing (using bcrypt with salt rounds of 10)
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    console.log("👤 Creating admin user...");

    // Create the admin user in the database
   const admin = await prisma.user.create({
  data: {
    name: adminData.name,
    email: adminData.email,
    phone: adminData.phone,
    password: hashedPassword,
    role: "ADMIN", // enum Role
  },
});


    // Display success message with credentials
    console.log("\n✅ Admin created successfully!");
   
  } catch (error) {
    console.error("\n❌ Error creating admin:", error.message);
    console.error("\n🔍 Full error details:");
    console.error(error);
    process.exit(1);
  } finally {
    // Always disconnect from database
    await prisma.$disconnect();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  }
};

// Run the function
createAdmin();