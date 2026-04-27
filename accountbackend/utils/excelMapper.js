/* 🔥 Auto column mapping (case insensitive + flexible names) */

export const columnMap = {
  fullName: ["student name", "name"],
  enrollmentNo: ["enrollment no", "enrollment"],
  phone: ["contact no", "phone"],
  course: ["course"],
  branch: ["branch"],
  admissionDate: ["admission date"],

  semFee: ["sem fee", "semester fee"],
  received: ["received"],
  balance: ["balance"],

  result: ["result"],
  resultStatus: ["result status"],
};

/* normalize header */
const normalize = (str) =>
  str?.toString().toLowerCase().replace(/\s+/g, "").trim();

/* find matching key */
export const mapRow = (row) => {
  const mapped = {};

  for (const key in columnMap) {
    for (const header of Object.keys(row)) {
      if (columnMap[key].includes(normalize(header))) {
        mapped[key] = row[header];
      }
    }
  }

  return mapped;
};