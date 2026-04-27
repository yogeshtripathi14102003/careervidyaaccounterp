


  

// import React, { useState, useEffect } from "react";
// import * as stumainservice from "../../services/stumainservice";

// const DynamicStudentTable = () => {
//   const [rawStudents, setRawStudents] = useState([]); // Original Data
//   const [filteredStudents, setFilteredStudents] = useState([]); // Filtered Data
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 📌 1. Fetch Data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await stumainservice.getStudentsService();
//       const data = res.data?.data || res.data || [];
//       const studentsArray = Array.isArray(data) ? data : [];
      
//       setRawStudents(studentsArray);
//       setFilteredStudents(studentsArray);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // 📌 2. Working Filter Logic (Front-end Search)
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredStudents(rawStudents);
//       return;
//     }

//     const lowerSearch = searchTerm.toLowerCase();
//     const filtered = rawStudents.filter((stu) =>
//       Object.values(stu).some((val) =>
//         String(val).toLowerCase().includes(lowerSearch)
//       )
//     );
//     setFilteredStudents(filtered);
//   }, [searchTerm, rawStudents]);

//   const getHeaders = () => {
//     if (rawStudents.length === 0) return [];
//     const ignoreList = ["id", "_id", "createdAt", "updatedAt", "studentId", "userId", "__v"];
//     return Object.keys(rawStudents[0]).filter((key) => !ignoreList.includes(key));
//   };

//   const headers = getHeaders();

//   // 📌 3. Nested Data UI (Green side indicator)
//   const renderNestedData = (items) => {
//     if (!Array.isArray(items) || items.length === 0) return <span style={{ color: "#ccc" }}>—</span>;

//     return (
//       <div style={{ display: "flex", gap: "20px", overflowX: "auto", scrollbarWidth: "none", padding: "5px 0" }}>
//         {items.map((item, i) => (
//           <div key={i} style={{ flexShrink: 0, paddingLeft: "10px", borderLeft: "3px solid #4CAF50" }}>
//             <div style={{ fontSize: "10px", fontWeight: "bold", color: "#1a73e8" }}>SEM {item.semester}</div>
//             <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
//               {Object.entries(item)
//                 .filter(([k]) => !["id", "studentId", "semester", "createdAt", "updatedAt"].includes(k))
//                 .map(([k, v]) => (
//                   <div key={k} style={{ whiteSpace: "nowrap" }}>
//                     <span style={{ color: "#888", fontWeight: "600" }}>{k}:</span> 
//                     <span style={{ color: "#333", marginLeft: "3px" }}>{v || 0}</span>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div style={{ backgroundColor: "#f4f7f9", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
//       {/* 🚀 Header Section (image_4ec269 style) */}
//       <div style={{ padding: "30px 25px", background: "#f4f7f9" }}>
//         <h1 style={{ margin: "0 0 15px 0", fontSize: "28px", color: "#2c3e50" }}>Career Vidya - Student Records</h1>
//         <input
//           type="text"
//           placeholder="Search anything (Name, Enrollment, Counselor...)"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{ 
//             width: "100%", padding: "14px 20px", borderRadius: "8px", 
//             border: "1px solid #ccc", fontSize: "16px", outline: "none",
//             boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
//           }}
//         />
//       </div>

//       {/* 📊 Table Content */}
//       <div style={{ padding: "0 25px 40px 25px" }}>
//         <div style={{ overflowX: "auto", background: "#fff", borderRadius: "8px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ background: "#34495e" }}>
//                 {headers.map((h) => (
//                   <th key={h} style={thStyle}>{h.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={headers.length} style={{ textAlign: "center", padding: "50px" }}>Loading...</td></tr>
//               ) : filteredStudents.length > 0 ? (
//                 filteredStudents.map((row, idx) => (
//                   <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
//                     {headers.map((header) => (
//                       <td key={header} style={tdStyle}>
//                         {Array.isArray(row[header]) 
//                           ? renderNestedData(row[header]) 
//                           : <span style={{ fontWeight: "500" }}>{String(row[header] || "—")}</span>
//                         }
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr><td colSpan={headers.length} style={{ textAlign: "center", padding: "50px", color: "#999" }}>No matching records found.</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Styles
// const thStyle = { padding: "15px 12px", textAlign: "left", color: "#fff", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap" };
// const tdStyle = { padding: "15px 12px", fontSize: "13px", color: "#333", verticalAlign: "middle" };

// export default DynamicStudentTable;

  
import React, { useState, useEffect } from "react";
import * as stumainservice from "../../services/stumainservice";

const DynamicStudentTable = () => {
  const [students, setStudents] = useState([]); // Ab ye paginated data store karega
  const [loading, setLoading] = useState(false);

  // 📌 1. Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // 📌 2. Dropdown states
  const [universities, setUniversities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedUniv, setSelectedUniv] = useState("");
  const [selectedSess, setSelectedSess] = useState("");

  const universityNames = { "1": "Subharti University", "2": "Mewar University", "3": "SVSU", "4": "Mangalayatan" };
  const sessionNames = { "1": "2023-24", "2": "2024-25", "3": "2025-26" };

  // 📌 3. Data Fetching (Backend Pagination logic ke saath)
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Backend expects: ?page=1&limit=10&search=...
      const results = await Promise.allSettled([
        stumainservice.getStudentsService({ 
            page: currentPage, 
            limit: limit, 
            search: searchTerm 
        }),
        stumainservice.getUniversitiesService(),
        stumainservice.getSessionsService()
      ]);

      if (results[0].status === "fulfilled") {
        const { data, total, totalPages: tPages } = results[0].value.data;
        setStudents(data || []);
        setTotalItems(total || 0);
        setTotalPages(tPages || 1);
      }
      if (results[1].status === "fulfilled") setUniversities(results[1].value.data || []);
      if (results[2].status === "fulfilled") setSessions(results[2].value.data || []);

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Jab Page badle, Limit badle, ya Search badle
  useEffect(() => {
    fetchAllData();
  }, [currentPage, limit, searchTerm]);

  // Dropdown filtering (Frontend logic ko safe rakha hai)
  const filteredDisplay = students.filter(stu => {
    let match = true;
    if (selectedUniv) match = match && String(stu.universityId) === String(selectedUniv);
    if (selectedSess) match = match && String(stu.sessionId) === String(selectedSess);
    return match;
  });

  const getHeaders = () => {
    if (students.length === 0) return [];
    const ignoreList = ["id", "_id", "createdAt", "updatedAt", "studentId", "userId", "__v"];
    return Object.keys(students[0]).filter((key) => !ignoreList.includes(key));
  };

  const headers = getHeaders();

  const formatValue = (key, val) => {
    if (key === "universityId") return universityNames[val] || `Univ-${val}`;
    if (key === "sessionId") return sessionNames[val] || `Sess-${val}`;
    return String(val || "—");
  };

  const renderNestedData = (items) => {
    if (!Array.isArray(items) || items.length === 0) return <span style={{ color: "#ccc" }}>—</span>;
    return (
      <div style={{ display: "flex", gap: "20px", overflowX: "auto", padding: "5px 0" }}>
        {items.map((item, i) => (
          <div key={i} style={{ flexShrink: 0, paddingLeft: "10px", borderLeft: "3px solid #4CAF50" }}>
            <div style={{ fontSize: "10px", fontWeight: "bold", color: "#1a73e8" }}>SEM {item.semester}</div>
            <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
              {Object.entries(item)
                .filter(([k]) => !["id", "studentId", "semester", "createdAt", "updatedAt"].includes(k))
                .map(([k, v]) => (
                  <div key={k} style={{ whiteSpace: "nowrap" }}>
                    <span style={{ color: "#888", fontWeight: "600" }}>{k}:</span> 
                    <span style={{ color: "#333", marginLeft: "3px" }}>{v || 0}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#f4f7f9", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ padding: "30px 25px", background: "#f4f7f9" }}>
        <h1 style={{ margin: "0 0 15px 0", fontSize: "28px", color: "#2c3e50" }}>Career Vidya - Student Records</h1>
        
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
          <select value={selectedUniv} onChange={(e) => setSelectedUniv(e.target.value)} style={selectStyle}>
            <option value="">All Universities</option>
            {universities.map(u => <option key={u.id} value={u.id}>{universityNames[u.id] || u.name}</option>)}
          </select>

          <select value={selectedSess} onChange={(e) => setSelectedSess(e.target.value)} style={selectStyle}>
            <option value="">All Sessions</option>
            {sessions.map(s => <option key={s.id} value={s.id}>{sessionNames[s.id] || s.year}</option>)}
          </select>

          <input
            type="text" placeholder="Search by name..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
            style={{ ...selectStyle, flex: 1, minWidth: "250px" }}
          />

          <select value={limit} onChange={(e) => { setLimit(e.target.value); setCurrentPage(1); }} style={selectStyle}>
             <option value="10">10 Rows</option>
             <option value="25">25 Rows</option>
             <option value="50">50 Rows</option>
          </select>
        </div>
      </div>

      <div style={{ padding: "0 25px 20px 25px" }}>
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: "8px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#34495e" }}>
                {headers.map((h) => (
                  <th key={h} style={thStyle}>{h.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={headers.length || 1} style={{ textAlign: "center", padding: "50px" }}>Loading...</td></tr>
              ) : filteredDisplay.length > 0 ? (
                filteredDisplay.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                    {headers.map((header) => (
                      <td key={header} style={tdStyle}>
                        {Array.isArray(row[header]) 
                          ? renderNestedData(row[header]) 
                          : <span style={{ fontWeight: "500" }}>{formatValue(header, row[header])}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={headers.length || 1} style={{ textAlign: "center", padding: "50px", color: "#999" }}>No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 📌 Pagination Footer Controls */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "20px", paddingBottom: "40px" }}>
           <button 
             disabled={currentPage === 1} 
             onClick={() => setCurrentPage(p => p - 1)}
             style={btnStyle}
           > Previous </button>

           <span style={{ fontWeight: "600", color: "#2c3e50" }}>
             Page {currentPage} of {totalPages} ({totalItems} total records)
           </span>

           <button 
             disabled={currentPage === totalPages} 
             onClick={() => setCurrentPage(p => p + 1)}
             style={btnStyle}
           > Next </button>
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const thStyle = { padding: "15px 12px", textAlign: "left", color: "#fff", fontSize: "11px", fontWeight: "bold", whiteSpace: "nowrap" };
const tdStyle = { padding: "15px 12px", fontSize: "13px", color: "#333", verticalAlign: "middle" };
const selectStyle = { padding: "12px 15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", outline: "none", background: "#fff", minWidth: "150px" };
const btnStyle = { padding: "10px 20px", borderRadius: "8px", border: "none", background: "#34495e", color: "#fff", cursor: "pointer", opacity: 0.9 };

export default DynamicStudentTable;