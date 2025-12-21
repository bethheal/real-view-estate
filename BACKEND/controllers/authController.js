import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// SIGNUP (existing code - updated)
export const signup = async (req, res) => {
  const { name, email, phone, password, confirmPassword, role } = req.body;

  try {
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Prevent admin signup through regular endpoint
    const validRoles = ["BUYER", "AGENT"];
    const formattedRole = role?.toUpperCase() || "BUYER";

    if (!validRoles.includes(formattedRole)) {
      return res
        .status(400)
        .json({ message: "Role must be either BUYER or AGENT" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const phoneRegex = /^(?:\+233|0)\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      return res.status(400).json({ message: "Password too weak" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPass = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashPass,
        role: formattedRole,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    console.log("signup error: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", details: error.message });
  }
};

// LOGIN (existing code)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Prevent admin login through regular endpoint
    if (user.role.includes("ADMIN")) {
      return res.status(403).json({ message: "Please use admin login endpoint" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    console.log("Login error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ADMIN LOGIN
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user has ADMIN role
    if (!user.role.includes("ADMIN")) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token with admin privileges
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "8h" } // Shorter expiry for admin sessions
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Admin login error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
