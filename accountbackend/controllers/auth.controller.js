// src/controllers/auth.controller.js


import User from "../models/authmodel.js";
import { 
registerUserService, 
  sendOtpService, 
  verifyOtpService, 
  setPasswordService,
  forgotPasswordService,
  verifyResetOtpService,
  resetPasswordService,
  loginUserService,
  getAllUsersService,
  getUserByIdService,
  deleteUserService,
  updateUserStatusService,
createSubAdminService,
updateSubAdminService,deleteSubAdminService,
updateUserService,
  updateUserPasswordService

} from "../services/auth.service.js";

// 1. REGISTER: सिर्फ OTP भेजता है (User अभी DB में नहीं बना है)
export const register = async (req, res, next) => {
  try {
    const result = await registerUserService(req.body);
    res.status(200).json({ 
      success: true, 
      message: "OTP sent to your email. Please verify to continue." 
    });
  } catch (err) { 
    next(err); 
  }
};

// 2. SEND/RESEND OTP: दोबारा OTP भेजने के लिए (यही फंक्शन मिसिंग था)
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendOtpService(email);
    res.status(200).json({ 
      success: true, 
      message: "A new OTP has been sent to your email." 
    });
  } catch (err) { 
    next(err); 
  }
};

// 3. VERIFY OTP: यहाँ असली User डेटाबेस में Create होता है
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOtpService(email, otp);
    
    res.status(201).json({ 
      success: true, 
      message: "OTP Verified. User account created successfully.", 
      userId: user.id,
      email: user.email,
      role: user.role // रोल भी वापस भेज रहे हैं
    });
  } catch (err) { 
    next(err); 
  }
};

// 4. SET PASSWORD: पासवर्ड सेट करके अकाउंट Active करना
export const setPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    await setPasswordService(email, password, confirmPassword);
    
    res.status(200).json({ 
      success: true, 
      message: "Password set successfully. Your account is now active." 
    });
  } catch (err) { 
    next(err); 
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const { userData, accessToken, refreshToken } = await loginUserService(email, password);

    const isProd = process.env.NODE_ENV === "production";

    // ✅ Refresh Token को HttpOnly Cookie में सेट करें (Security Best Practice)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd, 
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 दिन
      ...(isProd && { domain: ".careervidya.in" })
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken, // Access token response body में जाएगा
      user: userData
    });
  } catch (error) {
    next(error);
  }
};




// Forgot Password कंट्रोलर्स...
export const forgotPassword = async (req, res, next) => {
  try {
    await forgotPasswordService(req.body.email);
    res.status(200).json({ success: true, message: "OTP sent." });
  } catch (err) { next(err); }
};

export const verifyResetOtp = async (req, res, next) => {
  try {
    await verifyResetOtpService(req.body.email, req.body.otp);
    res.status(200).json({ success: true, message: "OTP verified." });
  } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    await resetPasswordService(email, password, confirmPassword);
    res.status(200).json({ success: true, message: "Password reset done." });
  } catch (err) { next(err); }
};

// all user 
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ success: true, data: users });
  } catch (err) { next(err); }
};

// 2. Get Single User
export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) { next(err); }
};

// 3. Delete User
export const deleteUser = async (req, res, next) => {
  try {
    const result = await deleteUserService(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

// ✅ LOGOUT: Bina service layer ke direct controller se
export const logout = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    // Browser ko instruction dena ki cookie delete kar de
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      ...(isProd && { domain: ".careervidya.in" })
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    // Agar koi unexpected error aaye (waise clearCookie mein error aata nahi hai)
    next(error);
  }
};
// Isse file ke ant mein jodein
// ✅ Export keyword check karein (Ye zaroori hai)
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Service function ko call kar rahe hain
    const result = await updateUserStatusService(id, status);
    
    res.status(200).json({ 
      success: true, 
      message: "Status updated successfully", 
      data: result 
    });
  } catch (err) { 
    // Agar service mein error aata hai (jaise user not found), toh wo yahan catch hoga
    next(err); 
  }
};

export const updateUser = async (req, res) => {
  try {
    const { studentIds, counselorId } = req.body;

    // --- CASE 1: Bulk/Single Assignment Logic ---
    if (studentIds) {
      // Agar single ID aa rahi hai toh use array mein convert kar dein
      const ids = Array.isArray(studentIds) ? studentIds : [studentIds];

      // Sequelize Bulk Update call
      const [updatedCount] = await User.update(
        { counselorId: counselorId },
        { where: { id: ids } }
      );

      if (updatedCount === 0) {
        return res.status(404).json({ success: false, message: "No students found to update" });
      }

      return res.status(200).json({
        success: true,
        message: `${updatedCount} students assigned successfully.`
      });
    }

    // --- CASE 2: Normal Profile Update (Using your existing Service) ---
    const { id } = req.params; 
    const result = await updateUserService(id, req.body);

    return res.status(200).json({
      success: true,
      data: result,
      message: "User updated successfully"
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Password Change Controller
export const updateUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) throw new ApiError(400, "New password is required");

    await updateUserPasswordService(req.params.id, password);
    res.status(200).json({ success: true, message: "Password changed" });
  } catch (err) { next(err); }
};

// create subadmin


export const createSubAdmin = async (req, res, next) => {
  try {
    const result = await createSubAdminService(req.body);

    res.status(201).json({
      success: true,
      message: "SubAdmin created",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateSubAdmin = async (req, res, next) => {
  try {
    const result = await updateSubAdminService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "SubAdmin updated",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteSubAdmin = async (req, res, next) => {
  try {
    const result = await deleteSubAdminService(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};