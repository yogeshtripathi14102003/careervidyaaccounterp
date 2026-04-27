import { Op } from "sequelize";


import { Student, StudentFees, StudentResult } from "../../models/maintable/RELATIONS.js";
/* ✅ CREATE */
export const createStudentService = async (body) => {
  const student = await Student.create(body);
  return student;
};

/* ✅ GET ALL (Pagination + Search) */
export const getStudentsService = async ({ page = 1, limit = 10, search = "" }) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Student.findAndCountAll({
    where: {
      fullName: {
        [Op.like]: `%${search}%`,
      },
    },
    // ⭐ YE SABSE ZAROORI HAI: Include with Alias
    include: [
      { 
        model: StudentFees, 
        as: "fees" // Wahi naam jo RELATIONS.js mein hai
      },
      { 
        model: StudentResult, 
        as: "results" // Wahi naam jo RELATIONS.js mein hai
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true, // Join ke waqt count duplicate hone se bachata hai
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

/* ✅ GET BY ID (WITH RELATIONS) */
export const getStudentByIdService = async (id) => {
  const student = await Student.findByPk(id, {
    include: [StudentFees, StudentResult],
  });

  if (!student) throw new Error("Student not found");

  return student;
};

/* ✅ UPDATE */
export const updateStudentService = async (id, body) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error("Student not found");

  await student.update(body);
  return student;
};

/* ✅ DELETE */
export const deleteStudentService = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) throw new Error("Student not found");

  await student.destroy();
  return true;
};

/* ✅ FILTER */
export const filterStudentsService = async ({ course, semester, resultStatus }) => {
  return await Student.findAll({
    where: {
      ...(course && { course }),
    },
    include: [
      {
        model: StudentFees,
        where: {
          ...(semester && { semester }),
        },
        required: false,
      },
      {
        model: StudentResult,
        where: {
          ...(semester && { semester }),
          ...(resultStatus && { resultStatus }),
        },
        required: false,
      },
    ],
  });
};