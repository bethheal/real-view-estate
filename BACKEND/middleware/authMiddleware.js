import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles;

    if (!Array.isArray(userRoles)) {
      return res
        .status(403)
        .json({ message: "Roles not found on token" });
    }

    const hasPermission = allowedRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};


export const requireAdmin = (req, res, next) => {
  if (!req.user?.roles?.includes("ADMIN")) {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
