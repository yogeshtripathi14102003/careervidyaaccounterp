import api from "../utils/api.js";

// 1. Saare Counselors get karne ke liye
export const getCounselors = async () => {
  try {
    const response = await api.get("/users");
    const allUsers = response.data.data || [];

    // Model mein 'counsellor' spelling hai isliye wahi filter use kiya
    const counselorsOnly = allUsers.filter(user => 
      user.role?.toLowerCase() === "counsellor"
    );
    
    return counselorsOnly;
  } catch (error) {
    console.error("Error fetching counselors:", error.response?.data || error.message);
    throw error;
  }
};

// 2. STATUS UPDATE: Aapke backend route router.patch("/users/status/:id") ke hisaab se
export const updateCounselorStatus = async (id, status) => {
  try {
    // Note: Backend route path match hona chahiye: /users/status/:id
    const response = await api.patch(`/users/status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating counselor status:", error.response?.data || error.message);
    throw error;
  }
};

// 3. ID se single counselor
export const getCounselorById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// 4. Delete counselor
export const deleteCounselor = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCounselorProfile = async (id, formData) => {
  try {
    // Ye aapke router.put("/users/:id", ...) ko hit karega
    const response = await api.put(`/users/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating counselor profile:", error.response?.data || error.message);
    throw error;
  }
};

/** * 2. Password Update (Dedicated Route)
 * Route: PATCH /users/change-password/:id
 */
export const updateCounselorPassword = async (id, newPassword) => {
  try {
    // Ye aapke router.patch("/users/change-password/:id", ...) ko hit karega
    const response = await api.patch(`/users/change-password/${id}`, { 
      password: newPassword 
    });
    return response.data;
  } catch (error) {
    console.error("Error updating counselor password:", error.response?.data || error.message);
    throw error;
  }
};



// --- STUDENT ASSIGNMENT & FETCHING API METHODS ---
// Bulk Assignment
export const bulkAssignStudents = async (studentIds, counselorId) => {
  try {
    // "/stu/assign-bulk" ko badal kar "/assign-bulk" karein
    const response = await api.put("/stu/assign-bulk", { 
      studentIds, 
      counselorId,
    });
    return response.data;
  } catch (error) {
    // Is line ko clean karein taaki console mein ":1" jaisa confusion na ho
    console.error("Bulk Assign Error:", error.response?.data?.message || error.message);
    throw error;
  }
};


// getcounslorservice.js mein update karein

export const fetchStudentsAndCounselors = async () => {
  try {
    // 1. Counselors ko Users table se layein (authroutes)
    const counselorRes = await api.get("/users"); 
    const allUsers = counselorRes.data.data || [];
    const counselors = allUsers.filter(u => u.role?.toLowerCase().includes("counsel"));

    // 2. Students ko Student table se layein (studentroutes - /api/v1/stu/students)
    const studentRes = await api.get("/stu/students"); 
    const students = studentRes.data.data || [];

    return {
      students: students, // Ab isme Student table ke saare naye log honge
      counselors: counselors
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};