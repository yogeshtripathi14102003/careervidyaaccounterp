import app from "./app.js";
import { seedDefaultAdmin } from "./seedadmin.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

// ✅ ONLY this (no destructuring)
import "./models/maintable/RELATIONS.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();