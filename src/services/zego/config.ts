import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import constants from "@/config/constants";

function generateRandomID(len: number = 5): string {
  const RANDOM_CHARS = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  const maxPos = RANDOM_CHARS.length;
  for (let i = 0; i < len; i++) {
    result += RANDOM_CHARS.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function generateZegoToken(roomID: string): string {
  const userID = generateRandomID(5);
  const userName = generateRandomID(5);
  
  return ZegoUIKitPrebuilt.generateKitTokenForTest(
    constants.ZEGO_APP_ID,
    constants.ZEGO_SERVER_SECRET,
    roomID,
    userID,
    userName
  )
}

export const ZegoConfig = {
  appId: constants.ZEGO_APP_ID,
  serverSecret: constants.ZEGO_SERVER_SECRET,
  generateRandomID,
  generateZegoToken
};
