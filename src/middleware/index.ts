import type { Middleware } from "@reduxjs/toolkit";

import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number };
    const statusCode = payload?.status;

    if (statusCode === 401) {
      toast.info("Vui lòng đăng nhập!");
    } else {
      // console.log("Error\n", action);
    }
  }

  return next(action);
};
