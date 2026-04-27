import { useState } from "react";
import  {studentapi} from "../services/stumainservice";

export const useStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveFullStudentData = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Isme Student + Fees + Result ka data ek saath bhej sakte ho 
      // agar backend controller handle kar raha hai
      const response = await studentApi.create(formData);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { saveFullStudentData, loading, error };
};