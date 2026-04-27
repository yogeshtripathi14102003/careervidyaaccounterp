import * as XLSX from "xlsx";

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsBinaryString(file);
  });
};