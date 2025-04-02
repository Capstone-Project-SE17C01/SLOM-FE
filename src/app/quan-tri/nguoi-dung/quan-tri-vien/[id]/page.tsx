import React from "react";

import AdminProfileModule from "@/features/users/components/admin/admin-profile";
const AdminProfile = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <AdminProfileModule />
    </div>
  );
};

export default AdminProfile;
