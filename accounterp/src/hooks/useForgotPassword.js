import { useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", 
});

const useForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "", // Route ke mutabiq name 'password' rakha hai
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  // 1. FORGOT PASSWORD (Send OTP)
  const handleSendOTP = async () => {
    if (!formData.email) return setError("Please enter your email.");
    setLoading(true);
    try {
      // Backend Route: /forgot-password
      const res = await API.post("/forgot-password", { email: formData.email });
      if (res.data.success) setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 2. VERIFY RESET OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) return setError("Please enter OTP.");
    setLoading(true);
    try {
      // Backend Route: /verify-reset-otp
      const res = await API.post("/verify-reset-otp", { 
        email: formData.email, 
        otp: formData.otp 
      });
      if (res.data.success) setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 3. RESET PASSWORD (Final Update)
  const handleResetPassword = async () => {
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    setLoading(true);
    try {
      // Backend Route: /reset-password
      const res = await API.post("/reset-password", { 
        email: formData.email, 
        password: formData.password,
        confirmPassword: formData.confirmPassword 
      });
      if (res.data.success) return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Error updating password.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, step, setStep, loading, error,
    handleChange, handleSendOTP, handleVerifyOTP, handleResetPassword
  };
};

export default useForgotPassword;