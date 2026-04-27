import AdmissionFees  from "../models/Adduniversity.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ CREATE FEES
export const createAdmissionFeesService = async (data) => {
  const existing = await AdmissionFees.findOne({
    where: {
      universityName: data.universityName,
      course: data.course,
      branch: data.branch,
      session: data.session,
    },
  });

  if (existing) {
    throw new ApiError(400, "Fees already exists for this session");
  }

  const fees = await AdmissionFees.create(data);
  return fees;
};

// ✅ GET ALL FEES
export const getAllFeesService = async () => {
  return await AdmissionFees.findAll({
    order: [["createdAt", "DESC"]],
  });
};

// ✅ GET SINGLE FEES
export const getFeesByIdService = async (id) => {
  const fees = await AdmissionFees.findByPk(id);

  if (!fees) {
    throw new ApiError(404, "Fees not found");
  }

  return fees;
};

// ✅ UPDATE FEES
export const updateFeesService = async (id, data) => {
  const fees = await AdmissionFees.findByPk(id);

  if (!fees) {
    throw new ApiError(404, "Fees not found");
  }

  await fees.update(data);

  return fees;
};

// ✅ DELETE FEES
export const deleteFeesService = async (id) => {
  const fees = await AdmissionFees.findByPk(id);

  if (!fees) {
    throw new ApiError(404, "Fees not found");
  }

  await fees.destroy();

  return { message: "Fees deleted successfully" };
};

// 🔥 SET CURRENT SESSION (IMPORTANT FEATURE)
export const setCurrentSessionService = async (id) => {
  const fees = await AdmissionFees.findByPk(id);

  if (!fees) {
    throw new ApiError(404, "Fees not found");
  }

  // पहले सभी को false करो
  await AdmissionFees.update(
    { isCurrent: false },
    { where: {} }
  );

  // फिर selected को true करो
  fees.isCurrent = true;
  await fees.save();

  return fees;
};