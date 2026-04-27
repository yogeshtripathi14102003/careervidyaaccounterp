import * as studentService from "../services/student.service.js";

// CREATE
export const createStudent = async (req, res) => {
  try {
    const student = await studentService.createStudent(req.body);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
export const getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY ID
export const getStudentById = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updateStudent = async (req, res) => {
  try {
    const updated = await studentService.updateStudent(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Student updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);

    res.json({
      success: true,
      message: "Student deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bulkAssignStudents = async (req, res) => {
  try {
    const { studentIds, counselorId } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || !counselorId) {
      return res.status(400).json({ 
        success: false, 
        message: "Student IDs (array) and Counselor ID are required." 
      });
    }

    // Destructure updatedCount from the array returned by service
    const [updatedCount] = await studentService.bulkAssignStudentsService(studentIds, counselorId);

    if (updatedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No students found or updated." 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `${updatedCount} students assigned successfully.` 
    });

  } catch (error) {
    console.error("Bulk Assign Controller Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};