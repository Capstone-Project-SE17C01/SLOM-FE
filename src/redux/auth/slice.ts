import { createSlice } from "@reduxjs/toolkit";

import {
  deleteClientCookie,
  getClientCookie,
  setClientCookie,
} from "@/utils/jsCookies";
import constants from "@/config/constants";

interface AuthSliceInterface {
  userInfo: {
    id?: string;
    username?: string;
    email: string;
    avatarUrl: string;
    role?: string;
    preferredLanguageId: string;
    firstname?: string;
    lastname?: string;
    courseId?: string;
    languageCode?: string;
    courseTitle?: string;
    vipUser?: boolean;
    roleName?: string;
  } | null;
  access_token: string | null;
}

const initialState: AuthSliceInterface = {
  userInfo: (() => {
    try {
      const userInfo = getClientCookie(constants.USER_INFO);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Error parsing userInfo cookie:", error);
      return null;
    }
  })(),
  access_token: getClientCookie(constants.ACCESS_TOKEN) || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { userInfo, accessToken } = action.payload;
      state.userInfo = userInfo;
      state.access_token = accessToken;
      if (userInfo) {
        setClientCookie(constants.USER_INFO, JSON.stringify(userInfo));
      }
      if (accessToken) {
        setClientCookie(constants.ACCESS_TOKEN, accessToken);
      }
      if (userInfo?.languageCode) {
        setClientCookie(constants.LOCALE, userInfo.languageCode);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      state.access_token = null;
      deleteClientCookie(constants.USER_INFO);
      deleteClientCookie(constants.ACCESS_TOKEN);
      deleteClientCookie(constants.LOCALE);
      // Clean up any other potential cookies if necessary
      deleteClientCookie("idToken");
      deleteClientCookie("refreshToken");
      deleteClientCookie("userEmail");
    },
  },
  extraReducers: () => {
    // Extra reducers can be kept for other purposes if needed,
    // but login logic is handled by setCredentials
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

