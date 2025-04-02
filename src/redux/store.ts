import { configureStore } from "@reduxjs/toolkit";

import { rtkQueryErrorLogger } from "./midleware";
import { baseApi } from "./baseApi";

import auth from "@/features/auth/slice";
import { authAPI } from "@/features/auth/api";
import { UploadApi } from "@/services/common/upload/api.upload";
import layout from "@/components/layouts/dashboard/slice";

export const store = configureStore({
  reducer: {
    [UploadApi.reducerPath]: UploadApi.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    auth,
    layout,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(UploadApi.middleware)
      .concat(rtkQueryErrorLogger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
