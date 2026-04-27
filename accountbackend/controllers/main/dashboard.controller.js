import { dashboardService } from "../../services/main/dashboard.service.js";

export const dashboardStats = async (req, res) => {
  try {
    const data = await dashboardService();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};