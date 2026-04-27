"use client";

import { useState } from "react";
import { createLead } from "../../../services/leadadmissionservices.js";

export default function LeadForm() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateFees = (data) => {
    const num = (v) => Number(v) || 0;

    return {
      ...data,
      totalFees:
        num(data.semesterFees) * num(data.semesterCount) +
        num(data.registrationFee) +
        num(data.admissionFees) +
        num(data.examFees),

      c_totalFees:
        num(data.c_semesterFees) * num(data.c_semesterCount) +
        num(data.c_registrationFee) +
        num(data.c_examFees) -
        num(data.c_discount),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalData = calculateFees(form);
      console.log("Sending Data:", finalData);

      await createLead(finalData);

      alert("Lead Created ✅");
      setForm({});
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Create Lead</h2>

        {/* Basic Info */}
        <div style={styles.grid}>
          <input name="studentName" placeholder="Student Name" onChange={handleChange} required style={styles.input} />
          <input name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
          <input name="phone" placeholder="Phone" onChange={handleChange} style={styles.input} />
          <input name="course" placeholder="Course" onChange={handleChange} style={styles.input} />
        </div>

        {/* Fees */}
        <h4 style={styles.subHeading}>Student Fees</h4>
        <div style={styles.grid}>
          <input name="semesterFees" placeholder="Semester Fees" onChange={handleChange} style={styles.input} />
          <input name="semesterCount" placeholder="Semester Count" onChange={handleChange} style={styles.input} />
          <input name="registrationFee" placeholder="Registration Fee" onChange={handleChange} style={styles.input} />
          <input name="admissionFees" placeholder="Admission Fees" onChange={handleChange} style={styles.input} />
          <input name="examFees" placeholder="Exam Fees" onChange={handleChange} style={styles.input} />
        </div>

        {/* Counselor/User Fees */}
        <h4 style={styles.subHeading}>User Fees</h4>
        <div style={styles.grid}>
          <input name="c_semesterFees" placeholder="User Semester Fees" onChange={handleChange} style={styles.input} />
          <input name="c_semesterCount" placeholder="User Semester Count" onChange={handleChange} style={styles.input} />
          <input name="c_registrationFee" placeholder="User Registration Fee" onChange={handleChange} style={styles.input} />
          <input name="c_examFees" placeholder="User Exam Fees" onChange={handleChange} style={styles.input} />
          <input name="c_discount" placeholder="Discount" onChange={handleChange} style={styles.input} />
        </div>

        {/* User Info */}
        <h4 style={styles.subHeading}>Assigned User</h4>
        <div style={styles.grid}>
          <input name="userName" placeholder="User Name" onChange={handleChange} required style={styles.input} />
          <input name="userId" placeholder="User ID" onChange={handleChange} style={styles.input} />
        </div>

        <button style={styles.button}>Submit</button>
      </form>
    </div>
  );
}

/* 🔥 Internal CSS */
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
    outline: "none",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};