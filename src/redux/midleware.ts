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
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  }

  return next(action);
};
