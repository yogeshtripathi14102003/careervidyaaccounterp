import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowLeft, RefreshCcw } from "lucide-react";
import useForgotPassword from "../../hooks/useForgotPassword"; // Hook ko import kiya
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  
  // Hook se saara logic aur state fetch kiya
  const { 
    formData, 
    step, 
    setStep, 
    loading, 
    error, 
    handleChange, 
    handleSendOTP, 
    handleVerifyOTP, 
    handleResetPassword 
  } = useForgotPassword();

  // Final step submit handler
  const onFinalSubmit = async (e) => {
    e.preventDefault();
    const res = await handleResetPassword();
    if (res?.success) {
      alert("Password updated successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="gn-auth-wrapper">
      <div className="gn-auth-card">
        {/* Back Button */}
        <button 
          className="back-btn-circle" 
          onClick={() => step > 1 ? setStep(step - 1) : navigate("/login")}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="gn-header mb-4">
          <h2 className="fw-bold">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Set New Password"}
          </h2>
          <p className="text-muted small">
            {step === 1 && "No worries! Enter your email to reset your access."}
            {step === 2 && `We've sent a 6-digit code to ${formData.email}`}
            {step === 3 && "Almost there! Choose a strong password."}
          </p>
        </div>

        {/* Mini Stepper Line */}
        <div className="mini-stepper mb-4">
          <div className={`m-step ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`m-step ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`m-step ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-danger py-2 small border-0 mb-3">{error}</div>}

        <div className="gn-form-container">
          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }} className="fade-in">
              <div className="gn-input-group">
                <label>Registered Email</label>
                <div className="gn-input-line-wrapper">
                  <Mail size={16} className="icon-muted" />
                  <input
                    name="email" // 'name' attribute zaroori hai hook ke liye
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="gn-prime-btn w-100 mt-3" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }} className="fade-in">
              <div className="gn-input-group">
                <label>Verification Code</label>
                <div className="gn-input-line-wrapper">
                  <ShieldCheck size={16} className="icon-muted" />
                  <input
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    className="text-center tracking-widest fw-bold"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="gn-prime-btn w-100 mt-3" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <div className="text-center mt-3">
                <button type="button" className="btn-link-small" onClick={handleSendOTP} disabled={loading}>
                  <RefreshCcw size={12} className="me-1" /> Resend Code
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <form onSubmit={onFinalSubmit} className="fade-in">
              <div className="gn-input-group mb-3">
                <label>New Password</label>
                <div className="gn-input-line-wrapper">
                  <Lock size={16} className="icon-muted" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="gn-input-group mb-4">
                <label>Confirm Password</label>
                <div className="gn-input-line-wrapper">
                  <Lock size={16} className="icon-muted" />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="gn-prime-btn w-100" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-5">
          <span className="back-to-login" onClick={() => navigate("/login")}>
            Return to Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;