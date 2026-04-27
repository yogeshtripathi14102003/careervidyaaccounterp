// src/models/user.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  phone: {
    type: DataTypes.STRING,
  },

  address: {
    type: DataTypes.STRING,
  },

  dob: {
    type: DataTypes.DATE,
  },

  fatherName: {
    type: DataTypes.STRING,
  },

  password: {
    type: DataTypes.STRING,
  },

  otp: {
    type: DataTypes.STRING,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  // ✅ ROLE FIELD ADD
  role: {
    type: DataTypes.ENUM("admin", "subadmin", "counsellor", "student"),
    defaultValue: "student",
  },

  // ✅ STATUS (optional but useful)
  status: {
    type: DataTypes.ENUM("active", "inactive", "blocked"),
    defaultValue: "active",
  },
}, {
  timestamps: true,
});

export default User;