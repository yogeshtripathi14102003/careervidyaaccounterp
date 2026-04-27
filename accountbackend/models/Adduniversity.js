import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AdmissionFees = sequelize.define("AdmissionFees", {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  universityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // 🔥 SESSION (Academic Year)
  session: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // 🔥 CURRENT SESSION FLAG
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  totalFees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  examFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  registrationFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  // 🔥 Semester fees JSON (MySQL me array direct nahi hota)
  semesterFees: {
    type: DataTypes.JSON,
    allowNull: true,
  },

}, {
  timestamps: true,
});

export default AdmissionFees;