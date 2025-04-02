import { createSlice } from "@reduxjs/toolkit";

import { authAPI } from "./api";
import { getClientCookie, setClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

interface AuthSliceInterface {
  userInfo: {
    avatarUrl: string;
    firstname: string;
    lastname: string;
  } | null;
  access_token: string | null;
}

const initialState: AuthSliceInterface = {
  userInfo: (() => {
    try {
      const userInfo = getClientCookie(constants.USER_INFO);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch {
      return null;
    }
  })(),
  access_token: getClientCookie(constants.ACCESS_TOKEN) || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authAPI.endpoints.loginWithGoogle.matchFulfilled,
      (state, action) => {
        state.userInfo = action.payload.user;
        state.access_token = action.payload.token;
        setClientCookie(constants.ACCESS_TOKEN, action.payload.token);
        setClientCookie(
          constants.USER_INFO,
          JSON.stringify(action.payload.user)
        );
      }
    );
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
