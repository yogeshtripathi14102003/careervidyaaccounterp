import Student from "../models/student.model.js";
import User from "../models/authmodel.js";

// CREATE
export const createStudent = async (data) => {
  return await Student.create(data);
};

// GET ALL
// student.service.js mein update karein
export const getAllStudents = async () => {
  return await Student.findAll({
    // Isse saare students aayenge, chahe unka counselorId NULL ho
    order: [["createdAt", "DESC"]],
  });
};

// GET BY ID
export const getStudentById = async (id) => {
  return await Student.findByPk(id);
};

// UPDATE
export const updateStudent = async (id, data) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error("Student not found");

  return await student.update(data);
};

// DELETE
export const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error("Student not found");

  return await student.destroy();
};



export const bulkAssignStudentsService = async (studentIds, counselorId) => {
  // ✅ Student model use karein aur 'role' condition ki zaroorat nahi hai
  const result = await Student.update(
    { counselorId: counselorId }, 
    {
      where: {
        id: studentIds // Sequelize automatically 'IN' query banayega array ke liye
      }
    }
  );

  return result; // Returns [affectedRowsCount]
};