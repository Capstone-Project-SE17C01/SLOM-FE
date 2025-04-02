import React from "react";

import StudentProfileModule from "@/features/users/components/student/student-profile";

const StudentProfile = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <StudentProfileModule />
    </div>
  );
};

export default StudentProfile;
