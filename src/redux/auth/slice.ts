import { createSlice } from "@reduxjs/toolkit";

import { authAPI } from "../../api/AuthApi";
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
      if (userInfo.languageCode) {
        setClientCookie(constants.LOCALE, userInfo.languageCode);
      }
      setClientCookie(constants.ACCESS_TOKEN, accessToken);
      setClientCookie(constants.USER_INFO, JSON.stringify(userInfo));
    },
    logout: (state) => {
      state.userInfo = null;
      state.access_token = null;
      document.cookie = `${constants.USER_INFO}=; path=/; max-age=0`;
      document.cookie = `${constants.ACCESS_TOKEN}=; path=/; max-age=0`;
      document.cookie = `idToken=; path=/; max-age=0`;
      document.cookie = `refreshToken=; path=/; max-age=0`;
      document.cookie = `userEmail=; path=/; max-age=0`;
      deleteClientCookie(constants.USER_INFO);
      deleteClientCookie(constants.ACCESS_TOKEN);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authAPI.endpoints.login.matchFulfilled, (state, action) => {
        const { accessToken } = action.payload;

        if (action.payload.userInfo) {
          state.userInfo = action.payload.userInfo;
        }
        state.access_token = accessToken;
      })
      .addMatcher(
        authAPI.endpoints.loginWithGoogle.matchFulfilled,
        (state, action) => {
          if (action.payload.userInfo) {
            state.userInfo = action.payload.userInfo;
          }
          state.access_token = action.payload.accessToken;
        }
      );
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
