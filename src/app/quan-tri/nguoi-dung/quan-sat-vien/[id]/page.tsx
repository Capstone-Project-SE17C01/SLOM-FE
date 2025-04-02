import React from "react";

import SupervisionProfileModule from "@/features/users/components/supervision/supervision-profile";

const AdminProfile = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <SupervisionProfileModule />
    </div>
  );
};

export default AdminProfile;
