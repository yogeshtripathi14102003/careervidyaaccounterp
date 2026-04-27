import Student from "../../models/maintable/stu.model.js";
 import StudentFees from "../../models/maintable/studentFees.model.js";
import { Sequelize } from "sequelize";

export const dashboardService = async () => {
  const totalStudents = await Student.count();

  const totalRevenue = await StudentFees.sum("received");

  const totalPending = await StudentFees.sum("balance");

  const courseWise = await Student.findAll({
    attributes: [
      "course",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
    ],
    group: ["course"],
  });

  return {
    totalStudents,
    totalRevenue,
    totalPending,
    courseWise,
  };
};