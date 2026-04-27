import {
  createLeadAdmissionService,
  getAllLeadAdmissionsService,
  getLeadAdmissionByIdService,
  updateLeadAdmissionService,
  deleteLeadAdmissionService
} from "../services/leadAdmission.service.js";

/* ================= CREATE ================= */
export const createLeadAdmission = async (req, res) => {
  try {
    const data = req.body;

  if (!data.studentName || !data.email || !data.userName) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* ================= AUTO TOTAL FEES ================= */
    data.totalFees =
      (data.semesterFees * data.semesterCount || 0) +
      (data.registrationFee || 0) +
      (data.admissionFees || 0) +
      (data.examFees || 0);

    /* ================= COUNSELOR TOTAL ================= */
    data.c_totalFees =
      (data.c_semesterFees * data.c_semesterCount || 0) +
      (data.c_registrationFee || 0) +
      (data.c_examFees || 0) -
      (data.c_discount || 0);

    const lead = await createLeadAdmissionService(data);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {

    /* 🔥 UNIQUE ERROR HANDLE */
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry (Email / Phone / Aadhaar already exists)",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getAllLeadAdmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search, course } = req.query;

    const data = await getAllLeadAdmissionsService({
      page,
      limit,
      search,
      course
    });

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET BY ID ================= */
export const getLeadAdmissionById = async (req, res) => {
  try {
    const lead = await getLeadAdmissionByIdService(req.params.id);

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
export const updateLeadAdmission = async (req, res) => {
  try {
    const data = req.body;

    /* ================= AUTO TOTAL FEES ================= */
    data.totalFees =
      (data.semesterFees * data.semesterCount || 0) +
      (data.registrationFee || 0) +
      (data.admissionFees || 0) +
      (data.examFees || 0);

    /* ================= COUNSELOR TOTAL ================= */
    data.c_totalFees =
      (data.c_semesterFees * data.c_semesterCount || 0) +
      (data.c_registrationFee || 0) +
      (data.c_examFees || 0) -
      (data.c_discount || 0);

    const lead = await updateLeadAdmissionService(req.params.id, data);

    res.json({
      success: true,
      message: "Updated successfully",
      data: lead,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteLeadAdmission = async (req, res) => {
  try {
    await deleteLeadAdmissionService(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};