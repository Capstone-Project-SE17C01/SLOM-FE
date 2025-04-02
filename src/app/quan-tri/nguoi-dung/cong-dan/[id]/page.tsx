import React from "react";

import CitizenProfileModule from "@/features/users/components/citizen/citizen-profile";

const CitizenProfile = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <CitizenProfileModule />
    </div>
  );
};

export default CitizenProfile;
