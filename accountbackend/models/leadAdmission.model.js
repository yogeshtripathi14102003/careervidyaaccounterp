import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const LeadAdmission = sequelize.define("LeadAdmission", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  studentName: { type: DataTypes.STRING, allowNull: false },
  fatherName: { type: DataTypes.STRING },
  motherName: { type: DataTypes.STRING },

  adhraNumber: { type: DataTypes.STRING, unique: true },
  dob: { type: DataTypes.DATEONLY },

  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    validate: { isEmail: true } 
  },

  phone: { type: DataTypes.STRING, unique: true },

  city: { type: DataTypes.STRING },
  universityName: { type: DataTypes.STRING },
  course: { type: DataTypes.STRING },
  branch: { type: DataTypes.STRING },

  admissionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

  // Fees
  semesterFees: { type: DataTypes.DECIMAL(10, 2) },
  semesterCount: { type: DataTypes.INTEGER },
  registrationFee: { type: DataTypes.DECIMAL(10, 2) },
  admissionFees: { type: DataTypes.DECIMAL(10, 2) },
  examFees: { type: DataTypes.DECIMAL(10, 2) },
  totalFees: { type: DataTypes.DECIMAL(10, 2) },

  // Counselor/User Calculation
  c_semesterFees: { type: DataTypes.DECIMAL(10, 2) },
  c_semesterCount: { type: DataTypes.INTEGER },
  c_registrationFee: { type: DataTypes.DECIMAL(10, 2) },
  c_examFees: { type: DataTypes.DECIMAL(10, 2) },
  c_discount: { type: DataTypes.DECIMAL(10, 2) },
  c_totalFees: { type: DataTypes.DECIMAL(10, 2) },

  discount: { type: DataTypes.STRING },
  refrelname: { type: DataTypes.STRING },

  // 🔥 REPLACED FIELD
  userName: { type: DataTypes.STRING, allowNull: false },

  // 🔥 FK → users table
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: "users", key: "id" }
  }

}, {
  timestamps: true
});

export default LeadAdmission;