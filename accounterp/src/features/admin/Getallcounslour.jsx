import React, { useEffect, useState } from "react";
import { 
  getCounselors, 
  deleteCounselor, 
  updateCounselorStatus,
} from "../../services/getcounslorservice";
import { useNavigate } from "react-router-dom";
import EditCounselor from "../admin/components/EditCounselor";

export default function AllCounselors() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const fetchAllCounselors = async () => {
    try {
      setLoading(true);
      const data = await getCounselors();
      setCounselors(data || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCounselors();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCounselorStatus(id, newStatus);
      setCounselors((prev) =>
        prev.map((c) => ((c._id || c.id) === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert("Status update failed!");
      fetchAllCounselors();
    }
  };

  const openEditModal = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteCounselor(id);
        setCounselors((prev) => prev.filter((c) => (c._id || c.id) !== id));
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  // ✅ SEARCH LOGIC (Name, Email aur Phone teeno ke liye)
  const filteredData = counselors.filter((c) => {
    const name = (c.name || c.fullName || "").toLowerCase();
    const email = (c.email || "").toLowerCase();
    const phone = (c.phone || "").toString(); // Phone number string format mein
    const target = searchTerm.toLowerCase();

    return (
      name.includes(target) || 
      email.includes(target) || 
      phone.includes(target)
    );
  });

  if (loading) return <div style={styles.loader}>Loading...</div>;

  return (
    <div style={styles.container}>
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button 
              style={styles.closeBtn} 
              onClick={() => {setShowEditModal(false); fetchAllCounselors();}}
            >✖</button>
            <EditCounselor 
              idFromProps={selectedId} 
              onSuccess={() => {setShowEditModal(false); fetchAllCounselors();}} 
            />
          </div>
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>Manage Counsellors</h2>
        <button style={styles.addBtn} onClick={() => navigate("/register")}>+ Register New</button>
      </div>

      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by Name, Email, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name & ID</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th> {/* ✅ Phone Column Added */}
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((c) => {
                const currentId = c._id || c.id;
                return (
                  <tr key={currentId} style={styles.tr}>
                    <td style={styles.td}>
                      <b>{c.name || c.fullName}</b><br/>
                      <small style={{color: "#94a3b8"}}>ID: {String(currentId).slice(-6)}</small>
                    </td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.phone || "N/A"}</td> {/* ✅ Display Phone */}
                    <td style={styles.td}>
                      <select
                        value={c.status || "active"}
                        onChange={(e) => handleStatusChange(currentId, e.target.value)}
                        style={styles.statusBadge}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.btnGroup}>
                        <button style={styles.editBtn} onClick={() => openEditModal(currentId)}>✏️ Edit</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(currentId)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                  No counselor found with "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  // Styles remains same as previous code
  container: { padding: "20px", position: "relative" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "20px", fontWeight: "bold" },
  addBtn: { padding: "8px 15px", backgroundColor: "#4f46e5", color: "white", borderRadius: "6px", border: "none", cursor: "pointer" },
  searchBox: { marginBottom: "15px" },
  input: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" },
  tableWrapper: { background: "white", borderRadius: "10px", overflowX: "auto", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f3f4f6", textAlign: "left" },
  th: { padding: "12px", fontSize: "14px", color: "#4b5563" },
  tr: { borderBottom: "1px solid #eee" },
  td: { padding: "12px", fontSize: "14px" },
  statusBadge: { padding: "5px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "13px" },
  btnGroup: { display: "flex", gap: "10px" },
  editBtn: { padding: "5px 10px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  deleteBtn: { padding: "5px 10px", backgroundColor: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "4px", cursor: "pointer" },
  loader: { textAlign: "center", marginTop: "50px" },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
  },
  modalContent: {
    background: "white", padding: "20px", borderRadius: "12px", width: "95%", maxWidth: "600px", position: "relative"
  },
  closeBtn: {
    position: "absolute", top: "15px", right: "15px", background: "#f3f4f6", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"
  }
};