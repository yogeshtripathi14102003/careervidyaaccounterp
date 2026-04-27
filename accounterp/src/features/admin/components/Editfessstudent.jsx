import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// PATH FIX: 3 baar '../' check karein agar hooks folder 'src/hooks' mein hai
import useStudentForm from "../../../hooks/cuseStudentForm"; 

export default function EditFees({ idFromProps }) {
  const { id: idFromUrl } = useParams();
  const studentId = idFromProps || idFromUrl; // Table ke liye props use karega, direct page ke liye URL
  
  const navigate = useNavigate();

  // Custom hook logic
  const { formData, handleChange, handleSubmit, fetchStudent, loading } = useStudentForm(studentId);

  useEffect(() => {
    if (studentId) {
      fetchStudent(studentId);
    }
  }, [studentId]);

  // Fees calculation
  const total = parseFloat(formData.totalFees) || 0;
  const paid = parseFloat(formData.paidFees) || 0;
  const unpaid = total - paid;

  const onSave = async (e) => {
    if(e) e.preventDefault();
    try {
      // Unpaid balance update karke save karein
      const finalData = { ...formData, unpaidFees: unpaid };
      await handleSubmit(finalData); 
      
      alert("Fees Record Updated!");
      
      // Agar props se khula hai toh navigate nahi karega
      if (!idFromProps) {
        navigate("/all-students");
      } else {
        fetchStudent(studentId); // Data refresh karega
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (loading && !formData.fullName) return <div style={styles.loadingContainer}>Loading Fees Data...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update Fees: {formData.fullName || "Student"}</h2>
      
      <div style={styles.feeCard}>
        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Course Fees</label>
            <input 
              type="number" 
              name="totalFees" 
              value={formData.totalFees || ""} 
              onChange={handleChange} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Semester Fees</label>
            <input 
              type="number" 
              name="semesterFees" 
              value={formData.semesterFees || ""} 
              onChange={handleChange} 
              style={styles.input} 
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admission Fees</label>
            <input 
              type="number" 
              name="admissionFees" 
              value={formData.admissionFees || ""} 
              onChange={handleChange} 
              style={styles.input} 
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={{...styles.label, color: '#059669'}}>Paid Fees (Received)</label>
            <input 
              type="number" 
              name="paidFees" 
              value={formData.paidFees || ""} 
              onChange={handleChange} 
              style={{...styles.input, borderColor: '#10b981'}} 
            />
          </div>
        </div>

        <div style={styles.summaryBox}>
          <div style={styles.summaryItem}>
            <span>Total Fees:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div style={styles.summaryItem}>
            <span>Paid Amount:</span>
            <span style={{color: '#059669'}}>- ₹{paid.toFixed(2)}</span>
          </div>
          <div style={styles.totalDue}>
            <span>Balance Due:</span>
            <span>₹{unpaid.toFixed(2)}</span>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={onSave} style={styles.saveButton}>Update Fees Record</button>
          {!idFromProps && (
             <button onClick={() => navigate(-1)} style={styles.cancelButton}>Go Back</button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "10px", maxWidth: "100%", margin: "0 auto", fontFamily: "sans-serif" },
  title: { fontSize: "18px", marginBottom: "15px", color: "#111827", fontWeight: 'bold' },
  label: { fontSize: "13px", color: "#374151", fontWeight: "500" },
  feeCard: { background: "#fff", padding: "15px", borderRadius: "8px", border: "1px solid #e5e7eb" },
  row: { display: "flex", gap: "15px", marginBottom: "12px" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", marginTop: "4px", fontSize: "14px" },
  summaryBox: { marginTop: "15px", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px dashed #d1d5db" },
  summaryItem: { display: "flex", justifyContent: "space-between", marginBottom: "5px", color: "#4b5563", fontSize: "14px" },
  totalDue: { display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #e5e7eb", fontWeight: "bold", fontSize: "16px", color: "#dc2626" },
  buttonGroup: { display: "flex", gap: "10px", marginTop: "15px" },
  saveButton: { flex: 2, padding: "12px", backgroundColor: "#059669", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  cancelButton: { flex: 1, padding: "12px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  loadingContainer: { textAlign: "center", padding: "20px" }
};