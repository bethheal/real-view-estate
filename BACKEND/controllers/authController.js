import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// SIGNUP
export const signup = async (req, res) => {
  // Include role in destructuring
  const { name, email, phone, password, confirmPassword, role } = req.body;

  try {
    // Validate all fields including role
    if (!name || !email || !phone || !password || !confirmPassword ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
     const validRoles = ['BUYER', 'AGENT'];
    const formattedRole = role?.toUpperCase() || 'BUYER';

    if (!validRoles.includes(formattedRole)) {
      return res.status(400).json({ message: 'Role must be either BUYER or AGENT' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone
    const phoneRegex = /^(?:\+233|0)\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashPass = await bcrypt.hash(password, 8);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashPass,
        role: role.toUpperCase(), // save role correctly
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });

  } catch (error) {
    console.log("signup error: ", error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password, role } = req.body; // <-- include role if you want role validation

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Optional: enforce login by role
    if (role && user.role !== role.toUpperCase()) {
      return res.status(400).json({ message: 'Invalid role for this user' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT including role
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });

  } catch (error) {
    console.log("Login error", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
