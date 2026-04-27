"use client";

import { useState } from "react";
import { createLead } from "../../services/leadadmissionservices.js";

export default function LeadForm() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* 🔥 GRAND TOTAL (WITH DISCOUNT) */
  const calculateTotal = (data) => {
    const num = (v) => Number(v) || 0;

    return (
      num(data.semesterFees) * num(data.semesterCount) +
      num(data.admissionFees) +
      num(data.examFees) -
      num(data.discount)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const totalFees = calculateTotal(form);

      const finalData = {
        ...form,
        totalFees,
      };

      await createLead(finalData);

      alert("Lead Created ✅");

      setForm({});
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  const total = calculateTotal(form);

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Create Lead</h2>

        {/* Basic Info */}
        <div style={styles.grid}>
          <input name="studentName" placeholder="Student Name" onChange={handleChange} required style={styles.input} />
          <input name="fatherName" placeholder="Father Name" onChange={handleChange} style={styles.input} />
          <input name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
          <input name="phone" placeholder="Phone" onChange={handleChange} style={styles.input} />
          <input name="course" placeholder="Course" onChange={handleChange} style={styles.input} />
          <input name="branch" placeholder="Branch" onChange={handleChange} style={styles.input} />
          <input name="university" placeholder="University Name" onChange={handleChange} style={styles.input} />
          <input name="admissionDate" type="date" onChange={handleChange} style={styles.input} />
          <input name="dob" type="date" onChange={handleChange} style={styles.input} />
        </div>

        {/* Fees */}
        <h4 style={styles.subHeading}>Fees</h4>
        <div style={styles.grid}>
          <input name="semesterFees" placeholder="Semester Fees" onChange={handleChange} style={styles.input} />
          <input name="semesterCount" placeholder="Semester Count" onChange={handleChange} style={styles.input} />
          <input name="admissionFees" placeholder="Admission Fees" onChange={handleChange} style={styles.input} />
          <input name="examFees" placeholder="Exam Fees" onChange={handleChange} style={styles.input} />
          <input name="discount" placeholder="Discount" onChange={handleChange} style={styles.input} />

          {/* 🔥 GRAND TOTAL */}
          <input
            value={total || 0}
            readOnly
            placeholder="Grand Total"
            style={{ ...styles.input, background: "#d4edda", fontWeight: "bold" }}
          />
        </div>

        <button style={styles.button}>Submit</button>
      </form>
    </div>
  );
}

/* CSS */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    background: "#f5f6fa",
  },
  form: {
    width: "100%",
    maxWidth: "800px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "15px",
    textAlign: "center",
  },
  subHeading: {
    marginTop: "20px",
    marginBottom: "10px",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};