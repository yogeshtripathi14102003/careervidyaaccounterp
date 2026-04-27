import { useState, useEffect, useMemo } from "react";
import { bulkAssignStudents, fetchStudentsAndCounselors, getCounselors } from "../services/getcounslorservice";

export const useTransferStudent = () => {
  const [students, setStudents] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [targetCounselor, setTargetCounselor] = useState(""); // Bulk target
  const [rowCounselors, setRowCounselors] = useState({}); // Individual row target: { studentId: counselorId }
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [filters, setFilters] = useState({ showUnassigned: false, fromCounselor: "" });

  const loadData = async () => {
    try {
      setPageLoading(true);
      const data = await fetchStudentsAndCounselors();
      setStudents(data.students || []);
      setCounselors(data.counselors || []);
    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filters.showUnassigned) return !s.counselorId;
      if (filters.fromCounselor) return s.counselorId === parseInt(filters.fromCounselor);
      return true;
    });
  }, [students, filters]);

  // --- Handlers ---
  const onToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const onSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const onFilterChange = (type, value) => {
    setSelectedIds([]);
    if (type === 'unassigned') {
      setFilters({ showUnassigned: !filters.showUnassigned, fromCounselor: "" });
    } else {
      setFilters({ showUnassigned: false, fromCounselor: value });
    }
  };

  // Row dropdown handler
  const onRowCounselorChange = (studentId, counselorId) => {
    setRowCounselors(prev => ({ ...prev, [studentId]: counselorId }));
  };

  // Main Assignment Logic (Works for both Bulk and Single)
  const performAssignment = async (ids, specificCounselorId = null) => {
    const targetId = specificCounselorId || targetCounselor;
    const idsToAssign = Array.isArray(ids) ? ids : [ids];

    if (!idsToAssign.length || !targetId) {
      alert("Please select student(s) and a counselor.");
      return;
    }

    try {
      setLoading(true);
      await bulkAssignStudents(idsToAssign, targetId);
      alert("Assignment Successful!");
      
      // Cleanup
      setSelectedIds([]);
      if (!specificCounselorId) setTargetCounselor(""); 
      else setRowCounselors(prev => {
          const updated = {...prev};
          delete updated[idsToAssign[0]];
          return updated;
      });

      loadData(); // Refresh table
    } catch (error) {
      alert(error.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    students: filteredStudents,
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
  };
};