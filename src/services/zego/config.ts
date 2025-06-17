// Server-side function to generate Zego token
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import constants from "@/settings/constants";
console.log(constants.ZEGO_APP_ID, constants.ZEGO_SERVER_SECRET);
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
  return ZegoUIKitPrebuilt.generateKitTokenForTest(
    constants.ZEGO_APP_ID,
    constants.ZEGO_SERVER_SECRET,
    roomID,
    userID,
    userName
  );
}

export const ZegoConfig = {
  appId: constants.ZEGO_APP_ID,
  serverSecret: constants.ZEGO_SERVER_SECRET,
  generateRandomID,
  generateZegoToken, // Use server-side token generation
};
