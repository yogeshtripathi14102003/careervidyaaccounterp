import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Phone, MapPin, Calendar, Lock, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import useCounsellorSignup from '../../hooks/useCounsellorSignup';
import './Signup.css';

const CounsellorSignup = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { 
    formData, step, setStep, loading, error, 
    handleChange, handleRegisterAndSendOTP, handleVerifyOTP, handleFinalPassword 
  } = useCounsellorSignup();

  // Final submit handler for step 3
  const onFinalSubmit = async (e) => {
    e.preventDefault();
    const res = await handleFinalPassword();
    if (res?.success) {
      alert("Registration Successful!");
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
            {step === 1 && "Create Account"}
            {step === 2 && "Verify Account"}
            {step === 3 && "Secure Account"}
          </h2>
          <p className="text-muted small">
            {step === 1 && "Join our professional network of counsellors."}
            {step === 2 && `We've sent a 6-digit code to ${formData.email}`}
            {step === 3 && "Set a strong password for your profile."}
          </p>
        </div>

        {/* Mini Stepper (Matches Forgot Password) */}
        <div className="mini-stepper mb-4">
          <div className={`m-step ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`m-step ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`m-step ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {error && <div className="alert alert-danger py-2 small border-0 mb-3">{error}</div>}

        <div className="gn-form-container">
          {/* Step 1: Profile Details */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleRegisterAndSendOTP(); }} className="fade-in">
              <div className="gn-input-group mb-3">
                <label>Full Name</label>
                <div className="gn-input-line-wrapper">
                  <User size={16} className="icon-muted" />
                  <input name="name" placeholder="Yogesh Kumar" value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6 gn-input-group mb-3">
                  <label>Email</label>
                  <div className="gn-input-line-wrapper">
                    <Mail size={16} className="icon-muted" />
                    <input type="email" name="email" placeholder="name@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-6 gn-input-group mb-3">
                  <label>Phone</label>
                  <div className="gn-input-line-wrapper">
                    <Phone size={16} className="icon-muted" />
                    <input name="phone" placeholder="+91..." value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="row g-2">
                <div className="col-md-6 gn-input-group mb-3">
                  <label>DOB</label>
                  <div className="gn-input-line-wrapper">
                    <Calendar size={16} className="icon-muted" />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-6 gn-input-group mb-3">
                  <label>Location</label>
                  <div className="gn-input-line-wrapper">
                    <MapPin size={16} className="icon-muted" />
                    <input name="address" placeholder="Delhi, India" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <button type="submit" className="gn-prime-btn w-100 mt-2" disabled={loading}>
                {loading ? "Processing..." : "Continue"}
              </button>

              <div className="gn-divider"><span>OR</span></div>
              
              <button type="button" className="gn-social-btn mb-2">
                <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="google" width="18" />
                Sign up with Google
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
                    placeholder="••••••"
                    maxLength="6"
                    className="text-center tracking-widest fw-bold"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="gn-prime-btn w-100 mt-3" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* Step 3: Security */}
          {step === 3 && (
            <form onSubmit={onFinalSubmit} className="fade-in">
              <div className="gn-input-group mb-3">
                <label>Password</label>
                <div className="gn-input-line-wrapper">
                  <Lock size={16} className="icon-muted" />
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
                {loading ? "Setting Up..." : "Finish Registration"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-4">
          <p className="small text-muted">
            Already a member? <span className="fw-bold text-dark cursor-pointer underline" onClick={() => navigate('/login')}>Login</span>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default CounsellorSignup;