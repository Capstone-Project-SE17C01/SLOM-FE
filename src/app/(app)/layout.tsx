import React from "react";

import AppLayout from "@/components/layouts/app/app-layout";

function AppRootLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

export default AppRootLayout;
