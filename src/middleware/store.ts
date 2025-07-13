import { configureStore } from "@reduxjs/toolkit";

import { rtkQueryErrorLogger } from ".";
import auth from "@/redux/auth/slice";
import { baseApi } from "../services";
import { authAPI } from "@/api/AuthApi";

export const store = configureStore({
  reducer: { [authAPI.reducerPath]: authAPI.reducer, auth },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(rtkQueryErrorLogger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
