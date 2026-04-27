import express from "express";
import {
  createFees,
  getAllFees,
  getFeesById,
  updateFees,
  deleteFees,
  setCurrentSession,
} from "../controllers/adduniversity.controller.js";
import {   protect, authorize } from "../middlewares/AuthMiddleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// CREATE
router.post("/uni", protect, authorize, createFees);

// GET ALL
router.get("/uni", protect, authorize, getAllFees);

// GET BY ID
router.get("/uni/:id", protect, authorize, getFeesById);

// UPDATE
router.put("/uni/:id", protect, authorize, updateFees);

// DELETE
router.delete("/uni/:id", protect, authorize, deleteFees);

// SET CURRENT SESSION
router.patch(
  "/set-current/:id",
  protect,
  authorize,
  setCurrentSession
);

export default router;