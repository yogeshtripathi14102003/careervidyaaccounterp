import { useState } from "react";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
} from "../services/cstudentService";

export default function useStudentForm(studentId = null) {
  const initialFormState = {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    fatherName: "",
    motherName: "",
    aadharNumber: "",
    course: "",
    branch: "",
    year: "",
    admissionYear: "",
    totalSemesters: "",
    currentSemester: "",
    totalFees: "",
    semesterFees: "",
    paidFees: "",
    unpaidFees: "",
    admissionFees: "",
    universityName: "",
    referralName: "",
    referralMobile: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create or Update
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (studentId) {
        // Update
        await updateStudent(studentId, formData);
        alert("Student record updated successfully!");
      } else {
        // Create
        await createStudent(formData);
        alert("Student record created successfully!");
        setFormData(initialFormState);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit student record!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single student for editing
  const fetchStudent = async (id) => {
    try {
      setLoading(true);
      const data = await getStudentById(id);
      setFormData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch student data!");
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      setLoading(true);
      await deleteStudent(id);
      alert("Student record deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete student record!");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    fetchStudent,
    handleDelete,
    loading,
  };
}