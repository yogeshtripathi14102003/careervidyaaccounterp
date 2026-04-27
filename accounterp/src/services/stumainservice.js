// import axios from "axios";

// const BASE_URL = "http://localhost:5000/api/v1/main";

// // ✅ CREATE
// export const createStudentService = (data) => {
//   return axios.post(`${BASE_URL}/students`, data);
// };

// // ✅ GET ALL
// export const getStudentsService = () => {
//   return axios.get(`${BASE_URL}/students`);
// };

// // ✅ GET BY ID
// export const getStudentByIdService = (id) => {
//   return axios.get(`${BASE_URL}/students/${id}`);
// };

// // ✅ UPDATE
// export const updateStudentService = (id, data) => {
//   return axios.put(`${BASE_URL}/students/${id}`, data);
// };

// // ✅ DELETE
// export const deleteStudentService = (id) => {
//   return axios.delete(`${BASE_URL}/students/${id}`);
// };

// // ✅ FILTER
// export const filterStudentsService = (params) => {
//   return axios.get(`${BASE_URL}/students/filter`, { params });
// };

// // ✅ DASHBOARD
// export const dashboardService = () => {
//   return axios.get(`${BASE_URL}/dashboard`);
// };
// // export const getAllStudentsWithDetailsService =() =>{
// //     return axios.get (`${BASE_URL}/students/details`)
// // }

// // ✅ EXCEL UPLOAD (IMPORTANT)
// export const uploadExcelService = (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   return axios.post(`${BASE_URL}/upload-excel`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };



import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/main";

// ✅ CREATE
export const createStudentService = (data) => {
  return axios.post(`${BASE_URL}/students`, data);
};

// ✅ GET ALL (Updated to support filters if needed)
export const getStudentsService = (params) => {
  return axios.get(`${BASE_URL}/students`, { params });
};

// ✅ GET BY ID
export const getStudentByIdService = (id) => {
  return axios.get(`${BASE_URL}/students/${id}`);
};

// ✅ UPDATE
export const updateStudentService = (id, data) => {
  return axios.put(`${BASE_URL}/students/${id}`, data);
};

// ✅ DELETE
export const deleteStudentService = (id) => {
  return axios.delete(`${BASE_URL}/students/${id}`);
};

// ✅ FILTER
export const filterStudentsService = (params) => {
  return axios.get(`${BASE_URL}/students/filter`, { params });
};

// ✅ DASHBOARD
export const dashboardService = () => {
  return axios.get(`${BASE_URL}/dashboard`);
};

// ✅ Dropdown Data Fetching Services
export const getUniversitiesService = () => {
  return axios.get(`${BASE_URL}/universities`);
};

export const getSessionsService = () => {
  return axios.get(`${BASE_URL}/sessions`);
};
// ✅ EXCEL UPLOAD (UPDATED: Added universityId and sessionId)
export const uploadExcelService = (file, universityId, sessionId) => {
  const formData = new FormData();
  
  
  // File ko append kiya
  formData.append("file", file);

  // University aur Session IDs ko append kiya (Backend req.body mein receive karega)
  formData.append("universityId", universityId);
  formData.append("sessionId", sessionId);

  return axios.post(`${BASE_URL}/upload-excel`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};