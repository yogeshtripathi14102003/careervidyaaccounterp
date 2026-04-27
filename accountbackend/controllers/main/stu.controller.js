import * as studentService from "../../services/main/stu.service.js";

/* CREATE */
export const createStudent = async (req, res) => {
  try {
    const data = await studentService.createStudentService(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* GET ALL */
export const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const data = await studentService.getStudentsService({
      page: +page,
      limit: +limit,
      search,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET BY ID */
export const getStudentById = async (req, res) => {
  try {
    const data = await studentService.getStudentByIdService(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* UPDATE */
export const updateStudent = async (req, res) => {
  try {
    const data = await studentService.updateStudentService(
      req.params.id,
      req.body
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* DELETE */
export const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudentService(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* FILTER */
export const filterStudents = async (req, res) => {
  try {
    const data = await studentService.filterStudentsService(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllStudentsWithDetails = async (req, res) => {
  try {
    const students = await getAllStudentsWithDetailsService();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students with details" });
  }
};
export const getAllUniversities = async (req, res) => {
  try {
    const universities = await Student.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('universityId')), 'id'],
        ['universityId', 'name'] // Dropdown me dikhane ke liye ID ko hi name maan rahe hain
      ],
      where: {
        universityId: { [Op.ne]: null } // Null values ko hatane ke liye
      }
    });
    res.json(universities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Session Dropdown ke liye: Student table se unique IDs nikalna
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Student.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('sessionId')), 'id'],
        ['sessionId', 'year']
      ],
      where: {
        sessionId: { [Op.ne]: null }
      }
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};