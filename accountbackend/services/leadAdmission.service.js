

/* ================= CREATE ================= */
export const createLeadAdmissionService = async (data) => {
  try {
    const lead = await LeadAdmission.create(data);
    return lead;
  } catch (error) {
    throw error;
  }
};

/* ================= GET ALL ================= */
import LeadAdmission from "../models/leadAdmission.model.js";
import { Op } from "sequelize";

/* ================= GET ALL WITH SEARCH ================= */
export const getAllLeadAdmissionsService = async ({ page, limit, search, course }) => {
  const offset = (page - 1) * limit;

  let whereCondition = {};

  // 🔍 Search (name, phone)
  if (search) {
    whereCondition[Op.or] = [
      { studentName: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } }
    ];
  }

  // 🎯 Filter (course)
  if (course) {
    whereCondition.course = { [Op.like]: `%${course}%` };
  }

  const { count, rows } = await LeadAdmission.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

/* ================= GET BY ID ================= */
export const getLeadAdmissionByIdService = async (id) => {
  const lead = await LeadAdmission.findByPk(id);
  if (!lead) throw new Error("Lead not found");
  return lead;
};

/* ================= UPDATE ================= */
export const updateLeadAdmissionService = async (id, data) => {
  const lead = await LeadAdmission.findByPk(id);
  if (!lead) throw new Error("Lead not found");

  await lead.update(data);
  return lead;
};

/* ================= DELETE ================= */
export const deleteLeadAdmissionService = async (id) => {
  const lead = await LeadAdmission.findByPk(id);
  if (!lead) throw new Error("Lead not found");

  await lead.destroy();
  return true;
};