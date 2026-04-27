// associations.js
import Student from "../../models/maintable/stu.model.js";
import StudentFees from "../../models/maintable/studentFees.model.js";
import StudentResult from "../../models/maintable/studentResult.model.js";

Student.hasMany(StudentFees,   { foreignKey: "studentId", as: "fees",    onDelete: "CASCADE" });
StudentFees.belongsTo(Student, { foreignKey: "studentId", as: "student"                     });

Student.hasMany(StudentResult,   { foreignKey: "studentId", as: "results", onDelete: "CASCADE" });
StudentResult.belongsTo(Student, { foreignKey: "studentId", as: "student"                      });

export { Student, StudentFees, StudentResult };