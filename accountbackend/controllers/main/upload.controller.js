// import { uploadExcelService } from "../../services/main/upload.service.js";

// export const uploadExcel = async (req, res) => {
//   try {
//     await uploadExcelService(req.file.buffer);
//     res.json({ message: "Excel uploaded successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import { uploadExcelService } from "../../services/main/upload.service.js";

export const uploadExcel = async (req, res) => {
  try {
    // 1. Frontend se FormData ke zariye ye dono IDs aayengi
    const { universityId, sessionId } = req.body;

    // 2. Validation: Agar IDs nahi hain toh error bhejien
    if (!universityId || !sessionId) {
      return res.status(400).json({ 
        error: "Please select University and Session from the dropdown." 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // 3. Teeno parameters Service ko pass karein
    const result = await uploadExcelService(req.file.buffer, universityId, sessionId);

    res.json({ 
      message: "Excel uploaded successfully",
      details: result 
    });
  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};