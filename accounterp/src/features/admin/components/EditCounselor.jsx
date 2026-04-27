import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getCounselorById, 
  updateCounselorProfile, 
  updateCounselorPassword 
} from "../../../services/getcounslorservice";

export default function EditCounselor({ idFromProps, onSuccess }) {
  const { id: idFromUrl } = useParams();
  const id = idFromProps || idFromUrl;
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    fatherName: "",
    status: ""
  });

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getCounselorById(id);
        
        // Data format set karein, khaas kar Date field ke liye
        setFormData({
          ...data,
          dob: data.dob ? data.dob.split('T')[0] : "" // Date format fix for HTML input
        });
      } catch (err) {
        console.error("Error loading counselor:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCounselorProfile(id, formData);
      alert("Profile updated successfully!");
      if (onSuccess) onSuccess(); 
    } catch (err) {
      alert("Update failed!");
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword) return alert("Please enter new password");
    try {
      await updateCounselorPassword(id, newPassword);
      alert("Password changed!");
      setShowPwdForm(false);
      setNewPassword("");
    } catch (err) {
      alert("Error changing password");
    }
  };

  if (loading) return <div style={{padding: "20px", textAlign: "center"}}>Loading Profile...</div>;

  return (
    <div style={{ width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "10px" }}>
      <form onSubmit={handleSubmit}>
        <div style={editStyles.grid}>
          {/* Name */}
          <div style={editStyles.field}>
            <label style={editStyles.label}>Full Name</label>
            <input name="name" value={formData.name || ""} onChange={handleChange} style={editStyles.input} required />
          </div>

          {/* Email (Disabled) */}
          <div style={editStyles.field}>
            <label style={editStyles.label}>Email (Non-editable)</label>
            <input value={formData.email || ""} disabled style={{...editStyles.input, backgroundColor: "#f3f4f6"}} />
          </div>

          {/* Phone */}
          <div style={editStyles.field}>
            <label style={editStyles.label}>Phone Number</label>
            <input name="phone" value={formData.phone || ""} onChange={handleChange} style={editStyles.input} />
          </div>

          {/* Father's Name */}
          <div style={editStyles.field}>
            <label style={editStyles.label}>Father's Name</label>
            <input name="fatherName" value={formData.fatherName || ""} onChange={handleChange} style={editStyles.input} />
          </div>

          {/* Date of Birth */}
          <div style={editStyles.field}>
            <label style={editStyles.label}>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} style={editStyles.input} />
          </div>

          {/* Status */}
          <div style={editStyles.field}>
            <label style={editStyles.label}>Account Status</label>
            <select name="status" value={formData.status || "active"} onChange={handleChange} style={editStyles.input}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Address - Full Width */}
        <div style={{...editStyles.field, marginTop: "10px"}}>
          <label style={editStyles.label}>Full Address</label>
          <textarea name="address" value={formData.address || ""} onChange={handleChange} style={{...editStyles.input, minHeight: "60px"}} />
        </div>

        <button type="submit" style={editStyles.saveBtn}>Update Profile</button>
      </form>

      <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />

      {!showPwdForm ? (
        <button onClick={() => setShowPwdForm(true)} style={editStyles.pwdBtn}>🔑 Change Account Password</button>
      ) : (
        <div style={editStyles.pwdBox}>
          <input 
            type="password" 
            placeholder="Enter New Password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            style={editStyles.input} 
          />
          <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
            <button onClick={handlePasswordSubmit} style={{...editStyles.saveBtn, margin: 0, backgroundColor: "#10b981"}}>Update</button>
            <button onClick={() => setShowPwdForm(false)} style={{...editStyles.saveBtn, margin: 0, backgroundColor: "#6b7280"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const editStyles = {
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  field: { marginBottom: "10px", display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#4b5563" },
  input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" },
  saveBtn: { width: "100%", padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "15px", fontWeight: "600" },
  pwdBtn: { width: "100%", background: "none", border: "1px dashed #4f46e5", color: "#4f46e5", padding: "10px", borderRadius: "6px", cursor: "pointer" },
  pwdBox: { padding: "15px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }
};