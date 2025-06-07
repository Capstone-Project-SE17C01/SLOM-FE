import type { NextApiRequest, NextApiResponse } from "next";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// This function should be in a separate utility file if used elsewhere
function generateRandomID(len: number = 5): string {
  const RANDOM_CHARS = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  let result = "";
  const maxPos = RANDOM_CHARS.length;
  for (let i = 0; i < len; i++) {
    result += RANDOM_CHARS.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { roomID } = req.body;

  if (!roomID || typeof roomID !== 'string') {
    return res.status(400).json({ message: 'roomID is required and must be a string.' });
  }

  const appID = process.env.ZEGO_APP_ID;
  const serverSecret = process.env.ZEGO_SERVER_SECRET;

  if (!appID || !serverSecret) {
    console.error("Zego App ID or Server Secret is not configured in environment variables.");
    return res.status(500).json({ message: "Server configuration error." });
  }

  const userID = generateRandomID(5);
  const userName = `user_${userID}`;

  try {
    const token = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      parseInt(appID),
      serverSecret,
      roomID,
      userID,
      userName
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Failed to generate Zego token:", error);
    return res.status(500).json({ message: "Failed to generate token." });
  }
} 