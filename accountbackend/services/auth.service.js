import bcrypt from "bcrypt";
import { ApiError } from '../utils/ApiError.js';
import { sendOTPEmail } from "../utils/sendEmail.js";
import User from "../models/authmodel.js"; // ✅ सुनिश्चित करें कि नाम 'User' ही हो
import jwt from "jsonwebtoken"; // 👈 यह लाइन जोड़ें

let tempStorage = {}; 

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. REGISTER: सिर्फ OTP भेजना (DB में एंट्री नहीं होगी) 
export const registerUserService = async (data) => {
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) throw new ApiError(400, "User already exists.");

  const otp = generateOTP();
  
  // डेटा को अस्थायी रूप से स्टोर करें
  tempStorage[data.email] = { ...data, otp };

  await sendOTPEmail(data.email, otp, data.name || "User");
  return { message: "OTP sent to email", otp }; // Testing के लिए otp साथ भेज रहे हैं
};

// 2. SEND/RESEND OTP: (यही मिसिंग था जिसकी वजह से एरर आ रही थी) 
export const sendOtpService = async (email) => {
  // अगर tempStorage में डेटा नहीं है, मतलब यूजर ने रजिस्टर स्टेप पूरा नहीं किया
  if (!tempStorage[email]) {
    throw new ApiError(404, "Registration data not found. Please register again.");
  }

  const newOtp = generateOTP();
  tempStorage[email].otp = newOtp; // पुराना OTP अपडेट करें

  await sendOTPEmail(email, newOtp, tempStorage[email].name);
  return { message: "New OTP sent", otp: newOtp };
};

// 3. VERIFY: सही होने पर ही DB में असली User सेव करना 
export const verifyOtpService = async (email, otp) => {
  const tempData = tempStorage[email];

  // 🔴 ये लॉग्स आपको टर्मिनल (VS Code) में देखने हैं
  console.log("--- OTP Verification Debug ---");
  console.log("Looking for Email:", email);
  console.log("Data found in tempStorage:", tempData ? "YES" : "NO");
  
  if (!tempData) {
    console.log("Current tempStorage Keys:", Object.keys(tempStorage));
    throw new ApiError(404, "OTP expired or Server Restarted. Please register again.");
  }

  console.log("Stored OTP:", tempData.otp, "Type:", typeof tempData.otp);
  console.log("Input OTP:", otp, "Type:", typeof otp);

  // Strict comparison with String conversion
  if (String(tempData.otp).trim() !== String(otp).trim()) {
    throw new ApiError(400, "Invalid OTP.");
  }

  // ✅ OTP Match - Create User
  const newUser = await User.create({
    ...tempData,
    isVerified: true,
    status: "inactive",
    otp: null 
  });

  delete tempStorage[email]; 
  return newUser;
};

// 4. SET PASSWORD: पासवर्ड अपडेट करना 
export const setPasswordService = async (email, password, confirmPassword) => {
  if (password !== confirmPassword) throw new ApiError(400, "Passwords mismatch.");
  
  const user = await User.findOne({ where: { email, isVerified: true } });
  if (!user) throw new ApiError(404, "User not verified or not found.");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.status = "active"; 
  await user.save();
  return user;
};


// login  logic will be implemented later after this registration flow is fully tested and working fine.


export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const loginUserService = async (email, password) => {
  // 1. य finde user email 
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(401, "Invalid Email or Password");
  }

  // 2.  check user active or not 
  if (user.status !== 'active' || !user.isVerified) {
    throw new ApiError(403, "Account not active. Please verify OTP first.");
  }

  // 3. password match
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Email or Password");
  }

  // 4. generate Access और Refresh Token
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // पासवर्ड हटाकर यूजर डेटा भेजें
  const userData = user.toJSON();
  delete userData.password;
  delete userData.otp;

  return { userData, accessToken, refreshToken };
};

// forget password logic 
// STEP 1: Forgot Password (Email Check & Send OTP)
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(404, "User with this email does not exist.");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // OTP को DB में सेव करें ताकि वेरीफाई हो सके
  user.otp = otp;
  await user.save();

  await sendOTPEmail(user.email, otp, user.name);
  return { message: "Reset OTP sent to email." };
};

// STEP 2: Verify Reset OTP
export const verifyResetOtpService = async (email, otp) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(404, "User not found.");

  if (String(user.otp).trim() !== String(otp).trim()) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  // OTP सही है, अब इसे null न करें (setPassword में काम आएगा)
  // बस ये सुनिश्चित करें कि verify हो चुका है
  return true;
};

// STEP 3: Update New Password
export const resetPasswordService = async (email, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) throw new ApiError(400, "Passwords do not match.");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(404, "User not found.");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.otp = null; // अब OTP साफ़ कर दें
  await user.save();

  return { message: "Password reset successful." };
};




// ✅ 1. GET ALL USERS (authmodel ki jagah User likha)
export const getAllUsersService = async () => {
  return await User.findAll({
    attributes: { exclude: ["password", "otp"] }, // सिक्योरिटी के लिए पासवर्ड छुपाएं
    order: [["createdAt", "DESC"]],
  });
};

// ✅ 2. GET USER BY ID (authmodel ki jagah User likha)
export const getUserByIdService = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password", "otp"] },
  });
  if (!user) throw new ApiError(404, "User not found"); // ApiError use karein
  return user;
};

// ✅ 3. DELETE USER BY ID (authmodel ki jagah User likha)
export const deleteUserService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found");

  await user.destroy(); // डेटाबेस से रिकॉर्ड डिलीट
  return { message: "User deleted successfully" };
};


// Isse file ke ant mein jodein
export const updateUserStatusService = async (id, status) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Valid status check (Model ke ENUM se match hona chahiye)
  const validStatuses = ["active", "inactive", "blocked"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  user.status = status;
  await user.save();

  return user;
};


// ✅ 1. Profile Data Update (Name, Phone, Status)
// user.service.js ya jahan bhi aapne ye service likhi hai

export const updateUserService = async (id, updateData) => {
  // 1. User ko check karein
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found");

  // 2. Security Check: Password ko updateData se hata dein 
  // kyunki password ke liye aapne alag dedicated route banaya hai.
  const { password, id: userId, email, role, ...updatableFields } = updateData;

  // 3. Dynamic Update: 
  // user.update() directly wahi fields update karega jo updatableFields mein hain
  await user.update(updatableFields);

  // 4. Response taiyar karein
  const result = user.toJSON();
  delete result.password; // Security: Password kabhi wapas nahi bhejna
  
  return result;
};// services/auth.service.js mein ye add karein:

export const bulkAssignService = async (studentIds, counselorId) => {
  // 1. Check karein ki studentIds array hai ya nahi
  const ids = Array.isArray(studentIds) ? studentIds : [studentIds];

  // 2. Sequelize ka update method use karein jo multiple IDs par kaam kare
  // Syntax: Model.update({ fields_to_update }, { where: { condition } })
  const [updatedCount] = await User.update(
    { counselorId: counselorId }, 
    { 
      where: { 
        id: ids,
        role: 'student' // Extra security: sirf students ko hi update kare
      } 
    }
  );

  if (updatedCount === 0) {
    throw new ApiError(404, "No students were found or updated");
  }

  return { message: `${updatedCount} students assigned successfully`, count: updatedCount };
};

// ✅ 2. Password Update (Alag se)
export const updateUserPasswordService = async (id, newPassword) => {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  await user.save();
  return { message: "Password updated successfully" };
};




// CREATE SUBADMIN
export const createSubAdminService = async (data) => {
  const { email, password, permissions } = data;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new ApiError(400, "SubAdmin already exists");

  const hashed = await bcrypt.hash(password, 10);

  const subAdmin = await User.create({
    name: data.name || "SubAdmin",
    email,
    password: hashed,
    role: "subadmin",
    isVerified: true,
    status: "active",
    permissions
  });

  return subAdmin.toJSON();
};

// UPDATE SUBADMIN
export const updateSubAdminService = async (id, data) => {
  const user = await User.findByPk(id);

  if (!user || user.role !== "subadmin") {
    throw new ApiError(404, "SubAdmin not found");
  }

  await user.update({
    permissions: data.permissions || user.permissions,
    status: data.status || user.status,
    name: data.name || user.name
  });

  return user.toJSON();
};

// DELETE SUBADMIN
export const deleteSubAdminService = async (id) => {
  const user = await User.findByPk(id);

  if (!user || user.role !== "subadmin") {
    throw new ApiError(404, "SubAdmin not found");
  }

  await user.destroy();

  return { message: "SubAdmin deleted successfully" };
};