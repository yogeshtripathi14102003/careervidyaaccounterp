import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

// 1. PROTECT: टोकन चेक करने के लिए
export const protect = (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(401, "Access denied. No token provided"));
    }

    // ✅ .env के नाम से मैच करें (JWT_ACCESS_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired. Please login again."));
    }
    return next(new ApiError(401, "Invalid token"));
  }
};

// 2. AUTHORIZE: रोल चेक करने के लिए (Admin Only)
export const authorize = (...roles) => {
  return (req, res, next) => {
    // अगर यूजर का रोल अलाउड लिस्ट में नहीं है
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Role ${req.user.role} is not authorized to access this resource`)
      );
    }
    next();
  };
};