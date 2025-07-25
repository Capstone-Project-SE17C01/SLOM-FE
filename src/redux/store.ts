import { configureStore } from "@reduxjs/toolkit";

import auth from "@/redux/auth/slice";
import { baseApi } from "../services";
import { authAPI } from "@/api/AuthApi";

export const store = configureStore({
  reducer: { [authAPI.reducerPath]: authAPI.reducer, auth },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
