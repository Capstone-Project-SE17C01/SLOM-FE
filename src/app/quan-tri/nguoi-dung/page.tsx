import { Metadata } from "next";

import UserManagementModule from "@/features/users/components/user-management";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
};

function Page() {
  return (
    <div>
      <UserManagementModule />
    </div>
  );
}

export default Page;
