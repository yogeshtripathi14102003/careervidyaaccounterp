import { DataTypes } from "sequelize";
 import sequelize  from "../../config/db.js";

const Student = sequelize.define("stu", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  universityId: {
  type: DataTypes.INTEGER,
  allowNull: false, // Mandatory karein taaki data mix na ho
  index: true,     // Search fast karne ke liye
},
sessionId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  index: true,
},

  enrollmentNo: {
    type: DataTypes.STRING,
    field: "enrollmentNo",  // must match exact DB column name
    unique: true,
  },

  registrationNo: {
    type: DataTypes.STRING,
  },

  counselorName: {
    type: DataTypes.STRING,
    index: true,
  },

  admissionDate: {
    type: DataTypes.DATEONLY,
    index: true,
  },

  phone: {
    type: DataTypes.STRING,
    index: true,
  },

  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true },
  },

  fatherName: DataTypes.STRING,
  motherName: DataTypes.STRING,

  dob: DataTypes.DATEONLY,

  aadharNumber: {
    type: DataTypes.STRING,
    unique: true,
  },

  course: {
    type: DataTypes.STRING,
    index: true,
  },

  branch: {
    type: DataTypes.STRING,
  },

  admissionStatus: {
    type: DataTypes.STRING,
    index: true,
  },

  totalCourseFee: DataTypes.DECIMAL(10, 2),
  totalReceivedFee: DataTypes.DECIMAL(10, 2),
  totalBalanceFee: DataTypes.DECIMAL(10, 2),

}, {
  timestamps: true,
  freezeTableName: true,

  indexes: [
    { fields: ["fullName"] },
    { fields: ["phone"] },
    { fields: ["course"] },
    { fields: ["admissionStatus"] },
    { unique: true, fields: ["enrollmentNo"] },
    { unique: true, fields: ["aadharNumber"] },
  ],
});

export default Student;