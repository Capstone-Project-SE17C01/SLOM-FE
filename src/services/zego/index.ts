import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

/**
 * Generates a random ID with specified length
 * @param len Length of the ID (default: 5)
 * @returns Random string ID
 */
export function generateRandomID(len: number = 5): string {
  let result = "";
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  const maxPos = chars.length;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

/**
 * Extract URL parameters from a URL string
 * @param url Optional URL string (defaults to current window location)
 * @returns URLSearchParams object
 */
export function getUrlParams(url?: string): URLSearchParams {
  // Check if window is defined (for SSR)
  if (typeof window === "undefined") return new URLSearchParams("");
  
  url = url || window.location.href;
  const urlParts = url.split("?");
  if (urlParts.length < 2) return new URLSearchParams("");
  return new URLSearchParams(urlParts[1]);
}

/**
 * Generate a Zego token for authentication
 * @param roomID The room ID for the meeting
 * @returns Token for Zego authentication
 */
export function generateZegoToken(roomID: string): string {
  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0");
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";
  const userID = generateRandomID(5);
  const userName = generateRandomID(5);
  
  return ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    userID,
    userName
  );
}

/**
 * Join a Zego room
 * @param element Container element reference
 * @param roomID Room ID for the meeting
 * @param onJoinRoom Callback function executed when room is joined
 * @returns Zego room instance or undefined if joining fails
 */
export function joinZegoRoom(
  element: HTMLDivElement, 
  roomID: string, 
  onJoinRoom?: () => void
): ReturnType<typeof ZegoUIKitPrebuilt.create> | undefined {
  try {
    // Generate token for authentication
    const kitToken = generateZegoToken(roomID);
    
    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
    // Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            typeof window !== "undefined"
              ? `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`
              : "",
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      onJoinRoom: onJoinRoom
    });
    
    return zp;
  } catch (error) {
    console.error("Failed to join meeting:", error);
    return undefined;
  }
}
