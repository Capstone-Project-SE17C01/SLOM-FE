import React from "react";

import MarketingLayout from "@/components/layouts/marketing/marketting-layout";

function MarketingRootLayout({ children }: { children: React.ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}

export default MarketingRootLayout;
