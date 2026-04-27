import { useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", 
});

const useCounsellorSignup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    role: "counsellor",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  // 1. REGISTER + SEND OTP
  const handleRegisterAndSendOTP = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      return setError("Please fill all details.");
    }
    setLoading(true);
    try {
      const regRes = await API.post("/register", formData);
      if (regRes.data.success || regRes.status === 201) {
        await API.post("/send-otp", { email: formData.email });
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration or OTP failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. VERIFY OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) return setError("Please enter OTP.");
    setLoading(true);
    try {
      await API.post("/verify-otp", { email: formData.email, otp: formData.otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3. SET PASSWORD (confirmPassword Added in Payload)
  const handleFinalPassword = async () => {
    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await API.post("/set-password", { 
        email: formData.email, 
        password: formData.password,
        confirmPassword: formData.confirmPassword // Backend isko compare kar raha hai
      });
      
      if (res.data.success) return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Error setting password");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, step, setStep, loading, error,
    handleChange, handleRegisterAndSendOTP, handleVerifyOTP, handleFinalPassword
  };
};

export default useCounsellorSignup;