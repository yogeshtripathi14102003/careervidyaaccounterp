// src/routes/auth.routes.js
import express from "express";
import {
  register,      // ✅ Step 1: रजिस्टर (डेटा फिल करना)
  sendOtp,       // (Optional: सिर्फ OTP दोबारा भेजने के लिए)
  verifyOtp,     // ✅ Step 2: OTP वेरिफिकेशन
  setPassword,    // ✅ Step 3: पासवर्ड सेट करना
  forgotPassword, 
  verifyResetOtp, 
  resetPassword,
  login,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserStatus,
  updateUser,
  updateUserPassword,
  createSubAdmin,
  updateSubAdmin,
  deleteSubAdmin,
  logout

} from "../controllers/auth.controller.js";
import {   protect, authorize } from "../middlewares/AuthMiddleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", register); 
router.post("/send-otp", sendOtp); 
router.post("/verify-otp", verifyOtp); 
 router.post("/login", login);
 router.get("/users", protect,authorize("admin"), getAllUsers);
router.get("/users/:id", protect,authorize("admin"), getUserById);
router.delete("/users/:id", protect,authorize("admin"), deleteUser);

// CREATE SUBADMIN
router.post(
  "/subadmin/create",
  protect,
  authorize("admin"),
  createSubAdmin
);

// UPDATE SUBADMIN
router.put(
  "/subadmin/:id",
  protect,
  authorize("admin"),
  updateSubAdmin
);

// DELETE SUBADMIN
router.delete(
  "/subadmin/:id",
  protect,
  authorize("admin"),
  deleteSubAdmin
);

router.post("/set-password", setPassword); 
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

router.patch("/users/status/:id", protect, authorize("admin"), updateUserStatus);
// Profile update (Name, Phone, Status)
router.put("/users/:id", protect, authorize("admin"), updateUser);

// Password update (Special route)
router.patch("/users/change-password/:id", protect, authorize("admin"), updateUserPassword);
export default router;