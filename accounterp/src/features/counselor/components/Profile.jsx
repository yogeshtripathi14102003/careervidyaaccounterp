import React, { useEffect, useState } from "react";
// Aapki di hui service file se functions import kiye
import { 
  getCounselorById, 
  updateCounselorProfile, 
  updateCounselorPassword 
} from "../../../services/getcounslorservice"; 
import { User, Mail, Phone, MapPin, Calendar, Lock, Loader2, Save, Shield } from "lucide-react";

export default function CounselorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", dob: "", fatherName: "", status: ""
  });

  useEffect(() => {
    // 1. LocalStorage se ID nikalna (Login ke waqt jo save ki thi)
    const counselorId = localStorage.getItem("userId"); 

    if (!counselorId) {
      alert("Session expired. Please login again.");
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        // Aapki service ka use karke data mangwaya
        const data = await getCounselorById(counselorId);
        setFormData({
          ...data,
          dob: data.dob ? data.dob.split('T')[0] : "" 
        });
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Profile Update Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const counselorId = localStorage.getItem("userId");
      await updateCounselorProfile(counselorId, formData);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed!");
    } finally {
      setSaving(false);
    }
  };

  // Password Update Logic
  const handlePasswordSubmit = async () => {
    if (!newPassword) return alert("Please enter password");
    try {
      const counselorId = localStorage.getItem("userId");
      await updateCounselorPassword(counselorId, newPassword);
      alert("Password changed successfully!");
      setShowPwdForm(false);
      setNewPassword("");
    } catch (err) {
      alert("Error changing password");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Profile</h2>
        <p style={styles.subtitle}>Manage your account information and security</p>
      </div>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}><User size={14} /> Full Name</label>
              <input name="name" value={formData.name || ""} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Mail size={14} /> Email Address</label>
              <input value={formData.email || ""} disabled style={{...styles.input, backgroundColor: "#f3f4f6"}} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Phone size={14} /> Mobile Number</label>
              <input name="phone" value={formData.phone || ""} onChange={handleChange} style={styles.input} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Calendar size={14} /> Date of Birth</label>
              <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={{marginTop: "20px"}}>
            <label style={styles.label}><MapPin size={14} /> Home Address</label>
            <textarea name="address" value={formData.address || ""} onChange={handleChange} style={styles.textarea} />
          </div>

          <button type="submit" disabled={saving} style={styles.saveBtn}>
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>

        <div style={styles.divider} />

        {!showPwdForm ? (
          <button onClick={() => setShowPwdForm(true)} style={styles.pwdBtn}>
            <Lock size={16} /> Change Account Password
          </button>
        ) : (
          <div style={styles.pwdBox}>
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              style={styles.input} 
            />
            <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
              <button onClick={handlePasswordSubmit} style={styles.confirmBtn}>Update</button>
              <button onClick={() => setShowPwdForm(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "0 auto" },
  header: { marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#111827" },
  subtitle: { color: "#6b7280", fontSize: "14px" },
  card: { backgroundColor: "white", padding: "25px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#374151", display: "flex", alignItems: "center", gap: "5px" },
  input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" },
  textarea: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", width: "100%", minHeight: "60px" },
  saveBtn: { marginTop: "20px", padding: "10px 20px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  divider: { height: "1px", backgroundColor: "#f3f4f6", margin: "25px 0" },
  pwdBtn: { background: "none", border: "1px solid #d1d5db", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" },
  pwdBox: { padding: "15px", backgroundColor: "#f9fafb", borderRadius: "8px" },
  confirmBtn: { padding: "6px 15px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  cancelBtn: { padding: "6px 15px", backgroundColor: "#9ca3af", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }
};