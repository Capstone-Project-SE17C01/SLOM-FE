import { createSlice } from "@reduxjs/toolkit";

import { getClientCookie, setClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

interface AuthSliceInterface {
  userInfo: {
    displayName: string;
    photoURL: string;
    email: string;
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
  name: "layout",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
      setClientCookie(constants.ACCESS_TOKEN, action.payload);
    },
  },
  extraReducers: (builder) => {},
});

export const { setUserInfo, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
