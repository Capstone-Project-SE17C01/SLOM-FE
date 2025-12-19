/**
 * Hardcoded authentication credentials for testing
 * This bypasses the login API for development/testing purposes
 */
import { setClientCookie, getClientCookie } from "@/utils/jsCookies";
import constants from "@/config/constants";
import { authSlice } from "@/redux/auth/slice";
import { store } from "@/redux/store";

export const HARDCODED_CREDENTIALS = {
  id: "49ee2498-2021-704c-25cc-bef22f73ec83",
  email: "quanpva.dev@gmail.com",
  role: "USER",
  roleName: "USER",
  username: "quanpva.dev",
  avatarUrl: "",
  preferredLanguageId: "en",
  languageCode: "en",
  courseTitle: "chooseCourse",
  vipUser: true,
};

export const HARDCODED_ACCESS_TOKEN = "hardcoded-access-token-for-testing";

/**
 * Set hardcoded credentials to cookies and Redux store
 * This function bypasses the login API
 */
export function setHardcodedCredentials() {
  const userInfo = HARDCODED_CREDENTIALS;
  const accessToken = HARDCODED_ACCESS_TOKEN;

  // Set cookies
  setClientCookie(constants.USER_INFO, JSON.stringify(userInfo), {
    expires: 30, // 30 days
    secure: false, // Allow in development
    sameSite: "lax",
  });

  setClientCookie(constants.ACCESS_TOKEN, accessToken, {
    expires: 30,
    secure: false,
    sameSite: "lax",
  });

  setClientCookie(constants.LOCALE, userInfo.languageCode, {
    expires: 30,
    secure: false,
    sameSite: "lax",
  });

  // Set Redux store
  store.dispatch(
    authSlice.actions.setCredentials({
      userInfo,
      accessToken,
    })
  );

  console.log("✅ Hardcoded credentials set:", {
    email: userInfo.email,
    role: userInfo.role,
    id: userInfo.id,
    vipUser: userInfo.vipUser,
  });
}

/**
 * Check if hardcoded credentials should be used
 * Returns true if no existing credentials are found OR if existing credentials don't match hardcoded user
 */
export function shouldUseHardcodedCredentials(): boolean {
  if (typeof window === "undefined") return false;

  const existingUserInfo = getClientCookie(constants.USER_INFO);
  const existingToken = getClientCookie(constants.ACCESS_TOKEN);

  // Use hardcoded if no existing credentials
  if (!existingUserInfo || !existingToken) {
    return true;
  }

  // Also check if existing user info matches hardcoded user but vipUser is not true
  try {
    const parsedUserInfo = JSON.parse(existingUserInfo);
    
    // If it's the same user but vipUser is not true, force update
    if (parsedUserInfo.email === HARDCODED_CREDENTIALS.email && parsedUserInfo.vipUser !== true) {
      console.log("🔄 Updating existing credentials to VIP status...");
      return true;
    }
    
    // If it's a different user, don't override
    if (parsedUserInfo.email !== HARDCODED_CREDENTIALS.email) {
      return false;
    }
  } catch (error) {
    console.error("Error parsing existing user info:", error);
    return true;
  }

  return false;
}

