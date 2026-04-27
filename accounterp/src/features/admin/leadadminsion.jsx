"use client";

import { useEffect, useState } from "react";
import Leadadmissionfrom from "./components/leadadmissionfrom.jsx";
import { getLeads, deleteLead } from "../../services/leadadmissionservices.js";
import Universityaddfees from "./components/Universityaddfees.jsx";

export default function LeadAdmissionPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [showUniversityForm, setShowUniversityForm] = useState(false); // 🔥 NEW

  const fetchLeads = async () => {
    try {
      const res = await getLeads({ search, course, page, limit: 10 });
      setLeads(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, course, page]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await deleteLead(id);
    fetchLeads();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
        Lead Admissions
      </h1>

      {/* 🔥 BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        
        {/* ❌ OLD BUTTON (FIXED TYPO ONLY) */}
        <button
          onClick={() => setShowUniversityForm(true)}
          style={{
            padding: "10px 15px",
            background: "green",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          + Add University
        </button>

        {/* EXISTING BUTTON */}
        <button
          onClick={() => setShowForm(true)}
          style={styles.addBtn}
        >
          + Add Admission
        </button>
      </div>

      {/* ✅ Admission MODAL */}
      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              onClick={() => setShowForm(false)}
              style={styles.closeBtn}
            >
              ✖
            </button>

            <Leadadmissionfrom
              onSuccess={() => {
                fetchLeads();
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 🔥 University MODAL */}
      {showUniversityForm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              onClick={() => setShowUniversityForm(false)}
              style={styles.closeBtn}
            >
              ✖
            </button>

            <Universityaddfees
              onSuccess={() => {
                setShowUniversityForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 🔍 Search */}
      <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        <input
          placeholder="Search name / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Filter by course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* 📄 Table */}
      <table style={styles.table}>
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th>Name</th>
            <th>Phone</th>
            <th>Course</th>
            <th>Total Fees</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((item) => (
            <tr key={item.id} style={{ textAlign: "center" }}>
              <td>{item.studentName}</td>
              <td>{item.phone}</td>
              <td>{item.course}</td>
              <td>{item.totalFees}</td>
              <td>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Pagination */}
      <div style={{ marginTop: "15px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={styles.pageBtn}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={styles.pageBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* 🔥 Styles */
const styles = {
  addBtn: {
    padding: "10px 15px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "800px",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  },

  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "red",
    color: "#fff",
    padding: "5px 10px",
    cursor: "pointer",
  },

  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "200px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  pageBtn: {
    padding: "5px 10px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
};