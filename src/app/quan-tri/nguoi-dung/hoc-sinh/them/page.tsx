import React from "react";

import AddNewStudentModule from "@/features/users/components/student/add-student";

const AddStudent = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <AddNewStudentModule />
    </div>
  );
};

export default AddStudent;
