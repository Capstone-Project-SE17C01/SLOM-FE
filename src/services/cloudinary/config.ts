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

interface CloudinaryListResponse {
  resources: Array<{
    public_id: string;
    secure_url: string;
    url: string;
    resource_type: string;
    format: string;
    width: number;
    height: number;
    duration: number;
    created_at: string;
    folder: string;
    [key: string]: unknown;
  }>;
  next_cursor?: string;
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

export const getAllVideosFromCloudinary = async (
  folder?: string,
  maxResults: number = 10,
  nextCursor?: string
): Promise<CloudinaryListResponse> => {
  const params = new URLSearchParams({
    type: 'upload',
    resource_type: 'video',
    max_results: maxResults.toString(),
  });

  if (folder) {
    params.append('prefix', folder);
  }

  if (nextCursor) {
    params.append('next_cursor', nextCursor);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/video?${params.toString()}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}:${process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET}`
        ).toString('base64')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch videos from Cloudinary');
  }

  return await response.json();
};
