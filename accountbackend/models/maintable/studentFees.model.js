

import { DataTypes } from "sequelize";
 import sequelize  from "../../config/db.js";
const StudentFees = sequelize.define("student_fees", {
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

  semFee: DataTypes.DECIMAL(10, 2),
  examFee: DataTypes.DECIMAL(10, 2),
  otherFee: DataTypes.DECIMAL(10, 2),
  discount: DataTypes.DECIMAL(10, 2),

  netPayable: DataTypes.DECIMAL(10, 2),
  received: DataTypes.DECIMAL(10, 2),
  balance: DataTypes.DECIMAL(10, 2),

}, {
  timestamps: true,
freezeTableName: true,
  indexes: [
    { fields: ["studentId"] },
    { fields: ["semester"] },
    { unique: true, fields: ["studentId", "semester"] }, // duplicate sem prevent
  ],
});

export default StudentFees;