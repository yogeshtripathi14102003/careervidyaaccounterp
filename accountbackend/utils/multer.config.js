import multer from "multer";

/* ✅ MEMORY STORAGE (Excel upload ke liye best) */
const storage = multer.memoryStorage();

/* ✅ FILE FILTER (sirf Excel allow) */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed"), false);
  }
};

/* ✅ LIMITS (Production safety) */
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

/* ✅ EXPORT */
const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;