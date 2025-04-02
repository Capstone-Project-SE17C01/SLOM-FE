import React from "react";

import ManagerProfileModule from "@/features/users/components/manager/manager-profile";

const AdminProfile = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <ManagerProfileModule />
    </div>
  );
};

export default AdminProfile;
