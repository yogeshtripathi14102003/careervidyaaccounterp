// import XLSX from "xlsx";
// import moment from "moment";
// import Student from "../../models/maintable/stu.model.js";
// import StudentFees from "../../models/maintable/studentFees.model.js";
// import StudentResult from "../../models/maintable/studentResult.model.js";

// const normalizeRow = (row) => {
//   const newRow = {};
//   Object.keys(row).forEach((key) => {
//     newRow[key.toLowerCase().replace(/\s+/g, "").trim()] = row[key];
//   });
//   return newRow;
// };

// const formatDate = (date) => {
//   if (!date) return null;
//   if (typeof date === "number") {
//     const parsed = XLSX.SSF.parse_date_code(date);
//     return moment({ year: parsed.y, month: parsed.m - 1, day: parsed.d }).format("YYYY-MM-DD");
//   }
//   const d = moment(date, ["DD-MMM-YYYY", "DD-MM-YYYY", "YYYY-MM-DD"]);
//   return d.isValid() ? d.format("YYYY-MM-DD") : null;
// };

// export const uploadExcelService = async (fileBuffer) => {
//   try {
//     const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(sheet);

//     const studentsMap = new Map();
//     const feesBulk = [];
//     const resultsBulk = [];

//     /* ✅ STEP 1: BUILD UNIQUE STUDENTS MAP */
//     for (const rawRow of data) {
//       const row = normalizeRow(rawRow);
//       const enrollmentNo = row.enrollmentno?.toString().trim();

//       // 🔥 FIX: skip blank rows
//       if (!enrollmentNo) {
//         console.log("⚠️ Skipping row - missing enrollmentNo");
//         continue;
//       }

//       if (!studentsMap.has(enrollmentNo)) {
//         studentsMap.set(enrollmentNo, {
//           fullName:       row.fullname       || row.studentname || "",
//           enrollmentNo,
//           universityId: universityId, 
//           sessionId: sessionId,
//           registrationNo: row.registrationno || "",
//           counselorName:  row.counselorname  || "",
//           admissionDate:  formatDate(row.admissiondate),
//           phone:          row.phone          || row.contactno || "",
//           email:          row.email          || "",
//           fatherName:     row.fathername     || "",
//           motherName:     row.mothername     || "",
//           dob:            formatDate(row.dob),
//           aadharNumber:   row.aadharnumber   || "",
//           course:         row.course         || "",
//           branch:         row.branch         || "",
//           admissionStatus:row.admissionstatus|| "",
//           totalCourseFee: row.totalcoursefee || 0,
//           totalReceivedFee: row.totalreceivedfee || 0,
//           totalBalanceFee:  row.totalbalancefee  || 0,
//         });
//       }
//     }

//     if (studentsMap.size === 0) {
//       return { totalRows: data.length, students: 0, fees: 0, results: 0 };
//     }

//     /* ✅ STEP 2: UPSERT STUDENTS ONE BY ONE (MySQL fix - no returning:true in bulkCreate)  */
//     const studentIdMap = {};

//     for (const [enrollmentNo, studentData] of studentsMap) {
//       // 🔥 FIX: findOrCreate works correctly in MySQL and returns the id
//       const [student] = await Student.findOrCreate({
//         where: { enrollmentNo },
//         defaults: studentData,
//       });
//       studentIdMap[enrollmentNo] = student.id;
//     }

//     /* ✅ STEP 3: BUILD FEES + RESULTS ARRAYS */
//     for (const rawRow of data) {
//       const row = normalizeRow(rawRow);
//       const enrollmentNo = row.enrollmentno?.toString().trim();
//       if (!enrollmentNo) continue;

//       const studentId = studentIdMap[enrollmentNo];
//       if (!studentId) {
//         console.log("❌ studentId not found for:", enrollmentNo);
//         continue;
//       }

//       feesBulk.push({
//         studentId,
//         semester:  row.semester  || 1,
//         semFee:    row.semfee    || 0,
//         examFee:   row.examfee   || 0,
//         otherFee:  row.otherfee  || 0,
//         discount:  row.discount  || 0,
//         netPayable: row.netpayable || 0,
//         received:  row.received  || 0,
//         balance:   row.balance   || 0,
//       });

//       resultsBulk.push({
//         studentId,
//         semester:        row.semester        || 1,
//         result:          row.result          || "",
//         resultStatus:    row.resultstatus     || "",
//         marksheetStatus: row.marksheetstatus  || "",
//         marksheetReceived: row.marksheetreceived || "",
//         examStatus:      row.examstatus       || "",
//       });
//     }

//     /* ✅ STEP 4: BULK INSERT FEES + RESULTS */
// /* ✅ STEP 4: BULK INSERT FEES + RESULTS WITH UPSERT LOGIC */

// if (feesBulk.length) {
//   await StudentFees.bulkCreate(feesBulk, {
//     // Agar [studentId, semester] ka unique combination milta hai, 
//     // toh niche diye gaye columns update ho jayenge
//     updateOnDuplicate: [
//       "semFee", 
//       "examFee", 
//       "otherFee", 
//       "discount", 
//       "netPayable", 
//       "received", 
//       "balance",
//       "updatedAt"
//     ]
//   });
// }

// if (resultsBulk.length) {
//   await StudentResult.bulkCreate(resultsBulk, {
//     // Result table ke liye upsert logic
//     updateOnDuplicate: [
//       "result", 
//       "resultStatus", 
//       "marksheetStatus", 
//       "marksheetReceived", 
//       "examStatus",
//       "updatedAt"
//     ]
//   });
// }

//     return {
//       totalRows: data.length,
//       students:  Object.keys(studentIdMap).length,
//       fees:      feesBulk.length,
//       results:   resultsBulk.length,
//     };

//   } catch (error) {
//     console.error("🔥 UPLOAD SERVICE ERROR:", error);
//     throw error;
//   }
// };

import XLSX from "xlsx";
import moment from "moment";
import Student from "../../models/maintable/stu.model.js";
import StudentFees from "../../models/maintable/studentFees.model.js";
import StudentResult from "../../models/maintable/studentResult.model.js";

const normalizeRow = (row) => {
  const newRow = {};
  Object.keys(row).forEach((key) => {
    newRow[key.toLowerCase().replace(/\s+/g, "").trim()] = row[key];
  });
  return newRow;
};

const formatDate = (date) => {
  if (!date) return null;
  if (typeof date === "number") {
    const parsed = XLSX.SSF.parse_date_code(date);
    return moment({ year: parsed.y, month: parsed.m - 1, day: parsed.d }).format("YYYY-MM-DD");
  }
  const d = moment(date, ["DD-MMM-YYYY", "DD-MM-YYYY", "YYYY-MM-DD"]);
  return d.isValid() ? d.format("YYYY-MM-DD") : null;
};

// ✅ FIXED: Added universityId and sessionId in parameters
export const uploadExcelService = async (fileBuffer, universityId, sessionId) => {
  try {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const studentsMap = new Map();
    const feesBulk = [];
    const resultsBulk = [];

    /* ✅ STEP 1: BUILD UNIQUE STUDENTS MAP */
    for (const rawRow of data) {
      const row = normalizeRow(rawRow);
      const enrollmentNo = row.enrollmentno?.toString().trim();

      if (!enrollmentNo) continue;

      if (!studentsMap.has(enrollmentNo)) {
        studentsMap.set(enrollmentNo, {
          fullName: row.fullname || row.studentname || "",
          enrollmentNo,
          universityId: universityId, // 🔥 Now defined
          sessionId: sessionId,       // 🔥 Now defined
          registrationNo: row.registrationno || "",
          counselorName: row.counselorname || "",
          admissionDate: formatDate(row.admissiondate),
          phone: row.phone || row.contactno || "",
          email: row.email || "",
          fatherName: row.fathername || "",
          motherName: row.mothername || "",
          dob: formatDate(row.dob),
          aadharNumber: row.aadharnumber || "",
          course: row.course || "",
          branch: row.branch || "",
          admissionStatus: row.admissionstatus || "",
          totalCourseFee: row.totalcoursefee || 0,
          totalReceivedFee: row.totalreceivedfee || 0,
          totalBalanceFee: row.totalbalancefee || 0,
        });
      }
    }

    if (studentsMap.size === 0) return { totalRows: 0, students: 0 };

    /* ✅ STEP 2: UPSERT STUDENTS (MySQL fix) */
    const studentIdMap = {};
    for (const [enrollmentNo, studentData] of studentsMap) {
      const [student] = await Student.findOrCreate({
        where: { enrollmentNo },
        defaults: studentData,
      });
      
      // Update university/session if student already exists
      await student.update({ universityId, sessionId });
      studentIdMap[enrollmentNo] = student.id;
    }

    /* ✅ STEP 3: BUILD FEES + RESULTS */
    for (const rawRow of data) {
      const row = normalizeRow(rawRow);
      const enrollmentNo = row.enrollmentno?.toString().trim();
      const studentId = studentIdMap[enrollmentNo];
      if (!studentId) continue;

      feesBulk.push({
        studentId,
        semester: row.semester || 1,
        semFee: row.semfee || 0,
        examFee: row.examfee || 0,
        netPayable: row.netpayable || 0,
        received: row.received || 0,
        balance: row.balance || 0,
      });

      resultsBulk.push({
        studentId,
        semester: row.semester || 1,
        result: row.result || "",
        resultStatus: row.resultstatus || "",
      });
    }

    /* ✅ STEP 4: BULK UPSERT */
    if (feesBulk.length) {
      await StudentFees.bulkCreate(feesBulk, {
        updateOnDuplicate: ["semFee", "examFee", "netPayable", "received", "balance", "updatedAt"]
      });
    }

    if (resultsBulk.length) {
      await StudentResult.bulkCreate(resultsBulk, {
        updateOnDuplicate: ["result", "resultStatus", "updatedAt"]
      });
    }

    return {
      totalRows: data.length,
      students: Object.keys(studentIdMap).length,
      fees: feesBulk.length,
      results: resultsBulk.length,
    };
  } catch (error) {
    console.error("🔥 UPLOAD SERVICE ERROR:", error);
    throw error;
  }
};