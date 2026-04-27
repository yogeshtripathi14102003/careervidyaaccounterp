import upload from "../utils/multer.config.js";
export { upload };

export const uploadSingle = (fieldName) => (req, res, next) => {
  const uploader = upload.single(fieldName);

  uploader(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message || "File upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "File is required",
      });
    }

    next();
  });
};
