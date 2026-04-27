export const getAllStudentsWithDetailsService = async () => {
  const students = await Student.findAll({
    include: [
      {
        model: StudentFees,
        required: false,   // include even if no fees
        as: "fees",
      },
      {
        model: StudentResult,
        required: false,   // include even if no results
        as: "results",
      },
    ],
    order: [["id", "ASC"]],
  });

  return students;
};