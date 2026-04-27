import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Eye, EyeOff, ArrowLeft } from "lucide-react"; 
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend API Call
      const response = await axios.post("http://localhost:5000/api/v1/login", {
        email,
        password,
      });

      // Backend response se data destructure karein
      // Aapke controller ke mutabik: { success, accessToken, user } mil raha hai
      const { success, accessToken, user } = response.data;

      if (success || accessToken) {
        // 1. Token, Role aur Name ko LocalStorage mein save karein
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userRole", user.role); 
        
        // Dashboard par "Undefined" fix karne ke liye user ka name save karein
        // Agar firstName hai toh wo, nahi toh pura name
        localStorage.setItem("userName", user.firstName || user.name || "User"); 

        // 2. Role-Based Navigation Logic
        if (user.role === "admin") {
          navigate("/admin/Dashboard");
        } else if (user.role === "counselor") {
          navigate("/counselor/DashboardLayout");
        } else {
          // Default redirection
          navigate("/counselor/DashboardLayout");
        }
      }
    } catch (error) {
      // Error handling
      const errorMsg = error.response?.data?.message || "Invalid Credentials. Please try again.";
      alert(errorMsg);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gn-login-wrapper">
      <div className="gn-login-card">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <div className="gn-header">
          <h2>Login Careervidya</h2>
          <p>Please enter your details to access your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="gn-form">
          {/* Email Field */}
          <div className="gn-input-group">
            <label>Email Address</label>
            <div className="gn-input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="counselor@careervidya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="gn-input-group">
            <label>Password</label>
            <div className="gn-input-wrapper">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="eye-btn" 
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <a href="/ForgotPassword" className="gn-forgot">Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="gn-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Login Now"}
          </button>

          <p className="gn-switch">
            Don't have an account? <span onClick={() => navigate("/Signup")}>Create Account</span>
          </p>

          <div className="gn-divider">
            <span>OR</span>
          </div>

          {/* Social Buttons */}
          <div className="social-container">
            <button type="button" className="gn-social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="fb" />
              Facebook
            </button>
            
            <button type="button" className="gn-social-btn">
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="google" />
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;