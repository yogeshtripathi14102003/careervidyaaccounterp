import api from "../utils/api.js";

// ✅ CREATE new student
export const createStudent = async (data) => {
  const response = await api.post("/stu/students", data);
  return response.data;
};

// ✅ GET all students
export const getStudents = async () => {
  const response = await api.get("/stu/students");
  return response.data;
};

// ✅ GET student by ID
export const getStudentById = async (id) => {
  const response = await api.get(`/stu/students/${id}`);
  return response.data;
};

// ✅ UPDATE student by ID
export const updateStudent = async (id, data) => {
  const response = await api.put(`/stu/students/${id}`, data);
  return response.data;
};

// ✅ DELETE student by ID
export const deleteStudent = async (id) => {
  const response = await api.delete(`/stu/students/${id}`);
  return response.data;
};