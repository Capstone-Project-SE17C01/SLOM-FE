// Server-side function to generate Zego token
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const ZEGO_APP_ID = parseInt(process.env.ZEGO_APP_ID || "1147290316");
const ZEGO_SERVER_SECRET = process.env.ZEGO_SERVER_SECRET || "7998e439ac9d1e3a2d22bb44583f929e";

// Function to generate a random user ID
function generateRandomID(len: number = 5): string {
  const RANDOM_CHARS = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  const maxPos = RANDOM_CHARS.length;
  for (let i = 0; i < len; i++) {
    result += RANDOM_CHARS.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Server-side function to generate Zego token
export function generateZegoToken(roomID: string): string {
  const userID = generateRandomID(5);
  const userName = generateRandomID(5);
  
  // Ensure proper token generation for production
  return ZegoUIKitPrebuilt.generateKitTokenForProduction(
    ZEGO_APP_ID,
    ZEGO_SERVER_SECRET,
    roomID,
    userID,
    userName
  );
}

export const ZegoConfig = {
  appId: ZEGO_APP_ID,
  serverSecret: ZEGO_SERVER_SECRET,
  generateRandomID,
  generateZegoToken, // Use server-side token generation
};
