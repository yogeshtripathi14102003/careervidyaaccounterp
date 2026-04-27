"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { uploadExcelService } from "../../services/stumainservice.js";

export default function UploadExcelPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  
  // 📌 1. Dropdowns ke liye State
  const [universityId, setUniversityId] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Static Data (Inhe aap actual API se bhi fetch kar sakte hain)
  const universities = [
    { id: 1, name: "VKRANT University" },
    { id: 4, name: "DPGU University" },
    { id: 3, name: "KU University" },
  ];

  const sessions = [
    { id: 1, year: "2023-24" },
    { id: 4, year: "2024-25" },
    { id: 3, year: "2025-26" },
  ];

  // 📌 Excel Read (Preview ke liye)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      setPreview(data);
    };
    reader.readAsBinaryString(selectedFile);
  };

  // 📌 Upload API call
  const handleUpload = async () => {
    // 📌 2. Validation: Bina selection ke aage nahi badhega
    if (!file) return alert("Pehle Excel file select karein!");
    if (!universityId) return alert("Pehle University select karein!");
    if (!sessionId) return alert("Pehle Session select karein!");

    try {
      // 🔥 3. Service ko File + University ID + Session ID bhej rahe hain
      await uploadExcelService(file, universityId, sessionId);
      
      alert("✅ Data successfully upload ho gaya!");
      
      // Reset form
      setFile(null);
      setPreview([]);
      setUniversityId("");
      setSessionId("");
      
      // Reset file input element
      document.getElementById("excel-input").value = "";

    } catch (err) {
      console.error("Upload Error:", err);
      alert("❌ Upload fail ho gaya. Check backend console.");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>MIS Data Upload Portal</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-end" }}>
          
          {/* 🏛️ University Dropdown */}
          <div style={{ minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>University Name:</label>
            <select 
              value={universityId} 
              onChange={(e) => setUniversityId(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            >
              <option value="">-- Select University --</option>
              {universities.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* 📅 Session Dropdown */}
          <div style={{ minWidth: "150px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Academic Session:</label>
            <select 
              value={sessionId} 
              onChange={(e) => setSessionId(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            >
              <option value="">-- Select Session --</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>{s.year}</option>
              ))}
            </select>
          </div>

          {/* 📁 File Input */}
          <div style={{ minWidth: "250px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Choose Excel File:</label>
            <input 
              id="excel-input"
              type="file" 
              onChange={handleFileChange} 
              accept=".xlsx, .xls" 
              style={{ width: "100%", padding: "7px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
          </div>

          {/* 🚀 Upload Button */}
          <button 
            onClick={handleUpload}
            style={{ 
              padding: "10px 30px", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "background 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
          >
            Start Bulk Upload
          </button>
        </div>
      </div>

      {/* 📊 Preview Section */}
      {preview.length > 0 && (
        <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h3 style={{ borderBottom: "2px solid #f4f4f4", paddingBottom: "10px" }}>
            Data Preview <span style={{ fontSize: "14px", color: "#666", fontWeight: "normal" }}>({preview.length} Records Found)</span>
          </h3>
          <div style={{ maxHeight: "500px", overflowY: "auto", marginTop: "15px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  {Object.keys(preview[0]).map((key) => (
                    <th key={key} style={{ padding: "12px", border: "1px solid #dee2e6", textAlign: "left" }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 50).map((row, i) => ( 
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: "10px", border: "1px solid #dee2e6" }}>{val?.toString() || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 50 && (
              <p style={{ textAlign: "center", padding: "15px", color: "#888" }}>... and {preview.length - 50} more rows (Showing first 50 for performance)</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}