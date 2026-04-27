import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  bulkAssignStudents,
} from "../controllers/student.controller.js";
import {   protect, authorize } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// CREATE
router.post("/students",  createStudent);

// GET ALL
router.get("/students", protect, authorize("admin"), getAllStudents);

// GET BY ID
router.get("/students/:id", protect, authorize("admin"), getStudentById);

// UPDATE
router.put("/students/:id", protect, authorize("admin"), updateStudent);

// DELETE
router.delete("/students/:id", protect, authorize("admin"), deleteStudent);

router.put("/assign-bulk", protect, authorize("admin"), bulkAssignStudents);

export default router;