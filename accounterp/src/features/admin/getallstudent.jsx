import React, { useEffect, useState } from "react";
import { getStudents } from "../../services/cstudentService";
import useStudentForm from "../../hooks/cuseStudentForm";
import EditStudent from "../admin/components/EditStudent"; 
import EditFees from "../admin/components/Editfessstudent"; // Fees component import kiya

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track karne ke liye ki kaunsa mode open hai (profile ya fees)
  const [editingId, setEditingId] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'profile' ya 'fees'

  const { handleDelete } = useStudentForm();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      const dataArray = Array.isArray(response) ? response : (response?.data || []);
      setStudents(dataArray);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  // Toggle Function
  const handleEditClick = (id, mode) => {
    if (editingId === id && editMode === mode) {
      setEditingId(null);
      setEditMode(null);
    } else {
      setEditingId(id);
      setEditMode(mode);
    }
  };

  const handleDeleteStudent = async (id) => {
    if(window.confirm("Are you sure you want to delete?")) {
      await handleDelete(id);
      setStudents((prev) => prev.filter((s) => (s._id || s.id) !== id));
    }
  };

  if (loading) return <div style={styles.loadingContainer}>Loading students...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student Management System</h1>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Course & Branch</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Total Fees</th>
            <th style={styles.th}>Paid</th>
            <th style={styles.th}>Balance</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => {
            const studentId = s._id || s.id;
            const isEditingProfile = editingId === studentId && editMode === 'profile';
            const isEditingFees = editingId === studentId && editMode === 'fees';
            const balance = (parseFloat(s.totalFees) || 0) - (parseFloat(s.paidFees) || 0);

            return (
              <React.Fragment key={studentId || index}>
                <tr style={styles.tr}>
                  <td style={styles.td}>
                    <strong style={styles.smallText}>{s.fullName}</strong><br/>
                    <small style={{color: '#6b7280', fontSize: '11px'}}>{s.email}</small>
                  </td>
                  <td style={{...styles.td, ...styles.smallText}}>{s.course} ({s.branch})</td>
                  <td style={{...styles.td, ...styles.smallText}}>{s.phone}</td>
                  <td style={{...styles.td, ...styles.smallText}}>₹{s.totalFees || 0}</td>
                  <td style={{...styles.td, ...styles.smallText, color: '#059669'}}>₹{s.paidFees || 0}</td>
                  <td style={{...styles.td, ...styles.smallText, color: '#dc2626', fontWeight: 'bold'}}>₹{balance}</td>
                  
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      {/* Profile Button */}
                      <button 
                        style={isEditingProfile ? styles.closeButton : styles.editButton}
                        onClick={() => handleEditClick(studentId, 'profile')}
                      >
                        {isEditingProfile ? "✖" : "✏️ Profile"}
                      </button>

                      {/* Fees Button */}
                      <button 
                        style={isEditingFees ? styles.closeButton : styles.feesButton}
                        onClick={() => handleEditClick(studentId, 'fees')}
                      >
                        {isEditingFees ? "✖" : "💰 Fees"}
                      </button>

                      <button style={styles.deleteButton} onClick={() => handleDeleteStudent(studentId)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Inline Component Rendering */}
                {(isEditingProfile || isEditingFees) && (
                  <tr>
                    <td colSpan="7" style={styles.editRow}>
                      <div style={{...styles.inlineEditCard, borderColor: isEditingFees ? '#10b981' : '#3b82f6'}}>
                        <div style={styles.cardHeader}>
                           <strong>{editMode === 'profile' ? "Updating Student Profile" : "Updating Fee Record"}</strong>
                           <button onClick={() => setEditingId(null)} style={styles.miniClose}>Close</button>
                        </div>
                        
                        {editMode === 'profile' ? (
                          <EditStudent idFromProps={studentId} /> 
                        ) : (
                          <EditFees idFromProps={studentId} /> 
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "1300px", margin: "0 auto", fontFamily: "sans-serif" },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#111827" },
  table: { width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", backgroundColor: "#fff", borderRadius: "8px" },
  tableHeader: { backgroundColor: "#f9fafb", textAlign: "left" },
  th: { padding: "12px", borderBottom: "2px solid #e5e7eb", color: "#374151", fontSize: "12px", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "10px", color: "#4b5563" },
  smallText: { fontSize: "13px" },
  actionGroup: { display: "flex", gap: "5px" },
  editButton: { padding: "5px 10px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  feesButton: { padding: "5px 10px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  closeButton: { padding: "5px 10px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  deleteButton: { padding: "5px 10px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  editRow: { backgroundColor: "#f9fafb" },
  inlineEditCard: { padding: "15px", border: "2px solid", borderRadius: "8px", margin: "10px" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "5px" },
  miniClose: { background: "none", border: "none", color: "red", cursor: "pointer", fontWeight: "bold" },
  loadingContainer: { textAlign: "center", padding: "50px", fontSize: "16px" }
};