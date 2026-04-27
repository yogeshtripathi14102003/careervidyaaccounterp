import helmet from "helmet";
import cors from "cors";

export const securityMiddleware = [
  helmet(),
  cors({
    origin: "http://localhost:5173", // '/' hata diya gaya hai
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Optional but good practice
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
];