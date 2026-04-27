
import { DataTypes } from "sequelize";
 import sequelize  from "../../config/db.js";

const StudentResult = sequelize.define("student_results", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  resultStatus: DataTypes.STRING,
  result: DataTypes.STRING,

  marksheetStatus: DataTypes.STRING,
  marksheetReceived: DataTypes.STRING,

  examStatus: DataTypes.STRING,

}, {
  timestamps: true,
  freezeTableName: true,
  indexes: [
    { fields: ["studentId"] },
    { fields: ["semester"] },
    { unique: true, fields: ["studentId", "semester"] },
  ],
});

export default StudentResult;