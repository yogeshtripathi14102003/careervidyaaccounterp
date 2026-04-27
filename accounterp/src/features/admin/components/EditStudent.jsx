import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Folder structure ke hisaab se 3 level piche jana hoga
import useStudentForm from "../../../hooks/cuseStudentForm";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Custom hook se functions nikal rahe hain
  const { formData, handleChange, handleSubmit, fetchStudent, loading } = useStudentForm(id);

  useEffect(() => {
    if (id) {
      fetchStudent(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSave = async (e) => {
    e.preventDefault();
    try {
      // Data save karne ke liye hook ka method call karein
      await handleSubmit(); 
      
      // Navigate nahi karna hai, isliye sirf alert dikhayenge
      alert("Profile successfully updated!");
      
      // Latest data dobara fetch karein taaki screen update ho jaye
      if (id) fetchStudent(id); 
      
    } catch (error) {
      console.error("Update failed:", error);
      alert("Kuch galti hui, update nahi ho paya.");
    }
  };

  if (loading) return <div style={styles.loadingContainer}>Loading Student Profile...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Student Profile: {formData?.fullName}</h2>
      <form onSubmit={onSave} style={styles.gridForm}>
        
        {/* PERSONAL DETAILS SECTION */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal Details</h3>
          <div style={styles.inputGroup}>
            <label>Full Name</label>
            <input name="fullName" value={formData.fullName || ""} onChange={handleChange} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>Phone Number</label>
            <input name="phone" value={formData.phone || ""} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>Aadhar Number</label>
            <input name="aadharNumber" value={formData.aadharNumber || ""} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        {/* FAMILY & ACADEMIC SECTION */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Family & Academic</h3>
          <div style={styles.inputGroup}>
            <label>Father's Name</label>
            <input name="fatherName" value={formData.fatherName || ""} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>Mother's Name</label>
            <input name="motherName" value={formData.motherName || ""} onChange={handleChange} style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>Admission Year</label>
            <input type="number" name="admissionYear" value={formData.admissionYear || ""} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        {/* COURSE DETAILS - FULL WIDTH */}
        <div style={styles.sectionFull}>
          <h3 style={styles.sectionTitle}>Course Details</h3>
          <div style={styles.grid3}>
            <div style={styles.inputGroup}>
              <label>Course</label>
              <input name="course" value={formData.course || ""} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label>Branch</label>
              <input name="branch" value={formData.branch || ""} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label>Current Year</label>
              <input name="year" value={formData.year || ""} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label>University Name</label>
            <input name="universityName" value={formData.universityName || ""} onChange={handleChange} style={styles.input} />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveButton}>Save Changes</button>
          <button type="button" onClick={() => navigate(-1)} style={styles.cancelButton}>Go Back</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" },
  title: { fontSize: "24px", fontWeight: "bold", color: "#333", borderBottom: "2px solid #3b82f6", paddingBottom: "10px", marginBottom: "20px" },
  gridForm: { display: "flex", flexWrap: "wrap", gap: "20px" },
  section: { flex: "1 1 450px", backgroundColor: "#f9fafb", padding: "20px", borderRadius: "10px", border: "1px solid #e5e7eb" },
  sectionFull: { flex: "1 1 100%", backgroundColor: "#f3f4f6", padding: "20px", borderRadius: "10px", border: "1px solid #e5e7eb" },
  sectionTitle: { fontSize: "18px", marginBottom: "15px", color: "#1f2937", borderBottom: "1px solid #ddd" },
  inputGroup: { display: "flex", flexDirection: "column", marginBottom: "12px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", marginTop: "5px", fontSize: "15px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" },
  buttonGroup: { display: "flex", gap: "15px", marginTop: "20px", width: "100%" },
  saveButton: { flex: 1, padding: "14px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  cancelButton: { flex: 1, padding: "14px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  loadingContainer: { textAlign: "center", padding: "100px", fontSize: "20px", color: "#666" }
};