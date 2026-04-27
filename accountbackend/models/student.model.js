import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Student = sequelize.define("students", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },

  phone: {
    type: DataTypes.STRING,
  },

  dob: {
    type: DataTypes.DATEONLY, // better for DOB
  },

  fatherName: {
    type: DataTypes.STRING,
  },

  motherName: {
    type: DataTypes.STRING,
  },

  aadharNumber: {
    type: DataTypes.STRING,
    unique: true,
  },

  course: {
    type: DataTypes.STRING,
  },

  branch: {
    type: DataTypes.STRING,
  },

  year: {
    type: DataTypes.STRING,
  },

  admissionYear: {
    type: DataTypes.INTEGER,
  },

  totalSemesters: {
    type: DataTypes.INTEGER,
  },

  currentSemester: {
    type: DataTypes.INTEGER,
  },

  totalFees: {
    type: DataTypes.DECIMAL(10, 2),
  },

  semesterFees: {
    type: DataTypes.DECIMAL(10, 2),
  },

  paidFees: {
    type: DataTypes.DECIMAL(10, 2),
  },

  unpaidFees: {
    type: DataTypes.DECIMAL(10, 2),
  },

  admissionFees: {
    type: DataTypes.DECIMAL(10, 2),
  },

  universityName: {
    type: DataTypes.STRING,
  },

  referralName: {
    type: DataTypes.STRING,
  },

  referralMobile: {
    type: DataTypes.STRING,
  },
  counselorId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Shuruat mein unassigned ho sakta hai
  },

}, {
  timestamps: true,
  freezeTableName: true,
});

export default Student;