import express from "express";

import {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,deleteStudent,filterStudents,
    getAllStudentsWithDetails,
    getAllUniversities,
    getAllSessions
    
} from "../controllers/main/stu.controller.js";

import { dashboardStats } from "../controllers/main/dashboard.controller.js";
import { uploadExcel } from "../controllers/main/upload.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* CRUD */
router.post("/students", createStudent);
router.get("/students", getStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

/* FILTER */
router.get("/students/filter", filterStudents);

/* DASHBOARD */
router.get("/dashboard", dashboardStats);
router.get("/students/details", getAllStudentsWithDetails);

/* EXCEL */
router.post("/upload-excel", upload.single("file"), uploadExcel);
router.get("/universities", getAllUniversities);


router.get("/sessions", getAllSessions);

export default router;