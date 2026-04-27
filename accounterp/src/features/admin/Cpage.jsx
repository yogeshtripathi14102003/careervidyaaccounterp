"use client";

import React from "react";
import cuseStudentForm from "../../hooks/cuseStudentForm";

export default function Cpage() {
  const { formData, handleChange, handleSubmit } = cuseStudentForm();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Heading */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎓 Student Registration</h1>
          <p style={styles.subtitle}>Fill all details to create student record</p>
        </div>

        {/* Form */}
        <div style={styles.grid}>
          <div style={styles.field}>
            <label>Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Father Name</label>
            <input
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="Enter father name"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Mother Name</label>
            <input
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              placeholder="Enter mother name"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Aadhar Number</label>
            <input
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="Enter Aadhar number"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Course</label>
            <input
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Enter course"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Branch</label>
            <input
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="Enter branch"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Year</label>
            <input
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter year"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Admission Year</label>
            <input
              name="admissionYear"
              value={formData.admissionYear}
              onChange={handleChange}
              placeholder="Enter admission year"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Total Semesters</label>
            <input
              name="totalSemesters"
              value={formData.totalSemesters}
              onChange={handleChange}
              placeholder="Enter total semesters"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Current Semester</label>
            <input
              name="currentSemester"
              value={formData.currentSemester}
              onChange={handleChange}
              placeholder="Enter current semester"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Total Fees</label>
            <input
              name="totalFees"
              value={formData.totalFees}
              onChange={handleChange}
              placeholder="Enter total fees"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Semester Fees</label>
            <input
              name="semesterFees"
              value={formData.semesterFees}
              onChange={handleChange}
              placeholder="Enter semester fees"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Paid Fees</label>
            <input
              name="paidFees"
              value={formData.paidFees}
              onChange={handleChange}
              placeholder="Enter paid fees"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Unpaid Fees</label>
            <input
              name="unpaidFees"
              value={formData.unpaidFees}
              onChange={handleChange}
              placeholder="Enter unpaid fees"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Admission Fees</label>
            <input
              name="admissionFees"
              value={formData.admissionFees}
              onChange={handleChange}
              placeholder="Enter admission fees"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>University Name</label>
            <input
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              placeholder="Enter university name"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Referral Name</label>
            <input
              name="referralName"
              value={formData.referralName}
              onChange={handleChange}
              placeholder="Enter referral name"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Referral Mobile</label>
            <input
              name="referralMobile"
              value={formData.referralMobile}
              onChange={handleChange}
              placeholder="Enter referral mobile"
              style={styles.input}
            />
          </div>
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          🚀 Submit Record
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #e0e7ff, #f0f9ff)",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "1000px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    color: "#374151",
  },
  input: {
    marginTop: "5px",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
  },
  button: {
    marginTop: "25px",
    width: "100%",
    padding: "14px",
    background: "linear-gradient(to right, #3b82f6, #2563eb)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};