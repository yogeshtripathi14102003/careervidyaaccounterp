import {
  createAdmissionFeesService,
  getAllFeesService,
  getFeesByIdService,
  updateFeesService,
  deleteFeesService,
  setCurrentSessionService,
} from "../services/university.service.js";

// ✅ CREATE
export const createFees = async (req, res, next) => {
  try {
    const result = await createAdmissionFeesService(req.body);

    res.status(201).json({
      success: true,
      message: "Fees created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET ALL
export const getAllFees = async (req, res, next) => {
  try {
    const result = await getAllFeesService();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ GET BY ID
export const getFeesById = async (req, res, next) => {
  try {
    const result = await getFeesByIdService(req.params.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE
export const updateFees = async (req, res, next) => {
  try {
    const result = await updateFeesService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Fees updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE
export const deleteFees = async (req, res, next) => {
  try {
    const result = await deleteFeesService(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

// 🔥 SET CURRENT SESSION
export const setCurrentSession = async (req, res, next) => {
  try {
    const result = await setCurrentSessionService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Current session updated",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};