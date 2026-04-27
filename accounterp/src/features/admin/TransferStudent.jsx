import React from "react";
import { useTransferStudent } from "../../hooks/useTransferStudent";

export default function TransferStudentUI() {
  const {
    students,
    counselors,
    selectedIds,
    filters,
    targetCounselor,
    setTargetCounselor,
    rowCounselors,
    loading,
    pageLoading,
    onToggleSelect,
    onSelectAll,
    onFilterChange,
    onRowCounselorChange,
    performAssignment
  } = useTransferStudent();

  if (pageLoading) return <div style={styles.loader}>Fetching Data...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Assignment Control</h2>
          {filters.fromCounselor && (
            <div style={styles.countBadge}>
              Students Count: <strong>{students.length}</strong>
            </div>
          )}
        </div>

        {/* --- Top Filter & Bulk Action Bar --- */}
        <div style={styles.filterSection}>
          <div style={styles.filterGroup}>
            <button
              style={{
                ...styles.filterBtn,
                backgroundColor: filters.showUnassigned ? "#4f46e5" : "#fff",
                color: filters.showUnassigned ? "#fff" : "#64748b"
              }}
              onClick={() => onFilterChange('unassigned')}
            >
              📂 Unassigned
            </button>
            <div style={styles.verticalDivider} />
            <label style={styles.label}>View Counselor:</label>
            <select
              style={styles.select}
              value={filters.fromCounselor}
              onChange={(e) => onFilterChange('from', e.target.value)}
            >
              <option value="">-- All Students --</option>
              {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={styles.actionGroup}>
            <label style={styles.label}>Bulk Target:</label>
            <select
              style={{ ...styles.select, borderColor: "#4f46e5" }}
              value={targetCounselor}
              onChange={(e) => setTargetCounselor(e.target.value)}
            >
              <option value="">-- Move To --</option>
              {counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button
              onClick={() => performAssignment(selectedIds)}
              style={{ ...styles.btn, opacity: (selectedIds.length && targetCounselor) ? 1 : 0.5 }}
              disabled={!selectedIds.length || !targetCounselor || loading}
            >
              Bulk Assign ({selectedIds.length})
            </button>
          </div>
        </div>

        {/* --- Students Table --- */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>
                  <input
                    type="checkbox"
                    onChange={onSelectAll}
                    checked={students.length > 0 && selectedIds.length === students.length}
                  />
                </th>
                <th style={styles.th}>Student Detail</th>
                <th style={styles.th}>Current Assigned</th>
                <th style={styles.th}>Direct Assignment</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(s.id)}
                        onChange={() => onToggleSelect(s.id)}
                      />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.nameBlock}>
                        <span style={styles.studentName}>{s.name}</span>
                        <span style={styles.studentEmail}>{s.email}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {s.counselorId ? (
                        <span style={styles.badgeCounselor}>Assigned</span>
                      ) : (
                        <span style={styles.badgeUnassigned}>New Student</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionCell}>
                        <select
                          style={styles.rowSelect}
                          value={rowCounselors[s.id] || ""}
                          onChange={(e) => onRowCounselorChange(s.id, e.target.value)}
                        >
                          <option value="">Select Counselor</option>
                          {counselors.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          style={{
                            ...styles.quickAssignBtn,
                            opacity: rowCounselors[s.id] ? 1 : 0.6
                          }}
                          onClick={() => performAssignment([s.id], rowCounselors[s.id])}
                          disabled={!rowCounselors[s.id] || loading}
                        >
                          Assign Now
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={styles.noData}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", backgroundColor: "#f1f5f9", minHeight: "100vh" },
  loader: { padding: "40px", textAlign: "center", color: "#64748b" },
  card: { backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  headerRow: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: "700", color: "#1e293b" },
  countBadge: { backgroundColor: "#e0e7ff", color: "#4338ca", padding: "6px 12px", borderRadius: "20px", fontSize: "13px" },
  filterSection: { display: "flex", justifyContent: "space-between", marginBottom: "20px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" },
  filterGroup: { display: "flex", alignItems: "center", gap: "10px" },
  actionGroup: { display: "flex", alignItems: "center", gap: "10px", borderLeft: "2px solid #e2e8f0", paddingLeft: "15px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#64748b" },
  filterBtn: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: "500" },
  select: { padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", minWidth: "140px" },
  btn: { padding: "10px 16px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  actionCell: { display: "flex", alignItems: "center", gap: "8px" },
  rowSelect: { padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "12px", minWidth: "130px" },
  quickAssignBtn: { padding: "5px 12px", backgroundColor: "#ecfdf5", color: "#059669", border: "1px solid #10b981", borderRadius: "4px", fontSize: "12px", cursor: "pointer", fontWeight: "600" },
  verticalDivider: { width: "1px", height: "25px", backgroundColor: "#e2e8f0" },
  tableWrapper: { border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f8fafc" },
  th: { padding: "12px 15px", textAlign: "left", fontSize: "11px", color: "#64748b", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 15px", fontSize: "14px" },
  nameBlock: { display: "flex", flexDirection: "column" },
  studentName: { fontWeight: "600", color: "#334155" },
  studentEmail: { fontSize: "12px", color: "#94a3b8" },
  badgeCounselor: { padding: "3px 10px", backgroundColor: "#eff6ff", color: "#2563eb", borderRadius: "12px", fontSize: "12px" },
  badgeUnassigned: { padding: "3px 10px", backgroundColor: "#fff1f2", color: "#e11d48", borderRadius: "12px", fontSize: "12px" },
  noData: { textAlign: "center", padding: "30px", color: "#94a3b8" }
};