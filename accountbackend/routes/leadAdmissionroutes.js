import express from "express";
import {
  createLeadAdmission,
  getAllLeadAdmissions,
  getLeadAdmissionById,
  updateLeadAdmission,
  deleteLeadAdmission
} from "../controllers/leadAdmission.controller.js";

const router = express.Router();

/* ================= ROUTES ================= */

router.post("/lead", createLeadAdmission);        // Create
router.get("/lead", getAllLeadAdmissions);        // Get All (pagination)
router.get("/lead/:id", getLeadAdmissionById);     // Get Single
router.put("/lead/:id", updateLeadAdmission);     // Update
router.delete("/lead/:id", deleteLeadAdmission);  // Delete

export default router;