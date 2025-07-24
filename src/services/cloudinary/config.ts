interface CloudinaryVideoUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  duration: number;
  [key: string]: unknown;
}

export const uploadVideoToCloudinary = async (file: File, folder: string = "general"): Promise<CloudinaryVideoUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("resource_type", "video");
  formData.append("folder", folder);
  
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

export const generateVideoFilename = (roomID: string): string => {
  return `meeting-${roomID}-${Date.now()}.webm`;
};

export const uploadImageToCloudinary = async (file: File, folder: string = "general"): Promise<CloudinaryVideoUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("resource_type", "image");
  formData.append("folder", folder);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
    {
      method: "POST",
      body: formData,
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to upload to Cloudinary");
  }
  
  return await response.json();
}
