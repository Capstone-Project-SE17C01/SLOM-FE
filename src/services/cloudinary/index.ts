// Cloudinary service for handling video uploads

/**
 * Cloudinary video upload response interface
 */
interface CloudinaryVideoUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  duration: number;
  [key: string]: unknown; // For any additional properties
}

/**
 * Uploads a video file to Cloudinary
 * @param file The file to upload
 * @param folder Optional folder name to organize uploads (defaults to "general")
 * @returns Response data from Cloudinary
 */
export const uploadVideoToCloudinary = async (file: File, folder: string = "general"): Promise<CloudinaryVideoUploadResponse> => {
  // Create FormData to send the file to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("resource_type", "video");
  formData.append("folder", folder);
  
  // Send the request to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, 
    {
      method: "POST",
      body: formData,
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to upload to Cloudinary");
  }
  
  return await response.json();
};

/**
 * Generates a unique filename for video uploads
 * @param roomID The meeting room ID
 * @returns A unique filename with timestamp
 */
export const generateVideoFilename = (roomID: string): string => {
  return `meeting-${roomID}-${Date.now()}.webm`;
};
