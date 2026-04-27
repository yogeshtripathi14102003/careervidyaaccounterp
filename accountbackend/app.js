// src/app.js
import express from "express";


// middlewares
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { limiter } from "./middlewares/rateLimit.middleware.js";
import { securityMiddleware } from "./middlewares/security.middleware.js";
import studentroutes from "./routes/studentroutes.js";
import authroutes from "./routes/authroutes.js";
import mainstudentroutes from "./routes/mainstudent.routes.js";
import leadAdmissionroutes from "./routes/leadAdmissionroutes.js";
import adduniversityroutes from "./routes/adduniversity.routes.js";
const app = express();

// JSON parser
app.use(express.json());

// URL encoded (form data)
app.use(express.urlencoded({ extended: true }));
// helmet + cors
app.use(securityMiddleware);
// rate limiter
app.use("/api", limiter);
// health check
app.get("/api/v1/ping", (req, res) => {
  res.send("🚀 API is running...");
});



app.use("/api/v1/stu",studentroutes);
app.use("/api/v1",authroutes);
app.use("/api/v1/main", mainstudentroutes);
app.use("/api/v1", leadAdmissionroutes);
app.use("/api/v1", adduniversityroutes);


// 404 handler
app.use(notFound);

// global error handler (ALWAYS LAST)
app.use(errorHandler);

export default app;