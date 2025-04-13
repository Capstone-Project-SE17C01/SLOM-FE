const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || "https://localhost:7150";
const RETURN_URL = process.env.NEXT_PUBLIC_RETURN_URL || "http://localhost:3000/success";
const CANCEL_URL = process.env.NEXT_PUBLIC_CANCEL_URL || "http://localhost:3000/cancel";
const API_SERVER_SOCKET = process?.env?.NEXT_PUBLIC_SERVER_SOCKET_URL;
const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;
const SITE_URL = "/";

const USER_INFO = "_user_info";
const ACCESS_TOKEN = "_access_token";
const REFRESH_TOKEN = "_refresh_token";
const IS_AUTH = "_is_auth";
const IS_EXPAND = "_is_expand";
const CLIENT_ID_GOOGLE = "63qb94i666qrkkojg95u54hoki";
const IDENTITY_PROVIDER_GOOGLE = "Google";
const REDIRECT_URL_GOOGLE = "http://localhost:3000/login";
const DOMAIN_GOOGLE =
  "ap-southeast-2kpv4t81dl.auth.ap-southeast-2.amazoncognito.com";
const ENPOINT_URL_GOOGLE = `https://${DOMAIN_GOOGLE}/oauth2/authorize?response_type=code&identity_provider=${IDENTITY_PROVIDER_GOOGLE}&client_id=${CLIENT_ID_GOOGLE}&redirect_uri=${REDIRECT_URL_GOOGLE}`;

const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyBRdNEv96bkOxhiiHICHIinRvpw4tWb9vk";
const FIREBASE_AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
  "capstone-959db.firebaseapp.com";
const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "capstone-959db";
const FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1048608078812";
const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "";
const FIREBASE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "";
const FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
const FIREBASE_KEY_PAIR = process.env.NEXT_PUBLIC_FIREBASE_KEY_PAIR || "";

const constants = {
  IS_EXPAND,
  API_SERVER,
  ASSETS_URL,
  SITE_URL,
  USER_INFO,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  IS_AUTH,
  API_SERVER_SOCKET,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_KEY_PAIR,
  RETURN_URL,
  CANCEL_URL,
  REDIRECT_URL_GOOGLE,
  ENPOINT_URL_GOOGLE,
};

export default constants;
