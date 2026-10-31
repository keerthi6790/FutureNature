import apiClient from "@/api/apiClient";

export interface UploadImageOptions {
  fileName?: string;
  folder?: "products" | "categories" | "banners" | "blogs" | "uploads" | string;
  contentType?: string;
}

/**
 * Converts a browser File object to a base64 Data URL string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an image to AWS S3 via the backend upload endpoint.
 * Accepts either a browser File object or a base64 Data URL string.
 * If the input is already an existing HTTP/S3 URL, it returns it as is.
 *
 * @param file File object or base64 string
 * @param folder Destination S3 folder ('products' | 'categories' | 'banners' | 'blogs' | 'uploads')
 * @param fileName Optional custom filename
 * @returns The public URL of the uploaded image on AWS S3
 */
export const uploadImageToAWS = async (
  file: File | string,
  folder: "products" | "categories" | "banners" | "blogs" | "uploads" | string = "uploads",
  fileName?: string
): Promise<string> => {
  // If already an existing hosted URL, return as is
  if (typeof file === "string" && (file.startsWith("http://") || file.startsWith("https://"))) {
    return file;
  }

  let base64Data: string;
  let finalFileName: string = fileName || "image.jpg";
  let contentType: string | undefined = undefined;

  if (file instanceof File) {
    finalFileName = fileName || file.name;
    contentType = file.type || undefined;
    base64Data = await fileToBase64(file);
  } else {
    base64Data = file;
  }

  const response = await apiClient.post<{
    status: boolean;
    message: string;
    url: string;
  }>("/upload", {
    file: base64Data,
    fileName: finalFileName,
    folder,
    contentType,
  });

  if (response.data && response.data.status && response.data.url) {
    return response.data.url;
  }

  throw new Error(response.data?.message || "Failed to upload image to AWS S3");
};

/**
 * Deletes an image from AWS S3 via backend API.
 * Accepts either a public AWS S3 URL or S3 object key.
 * If the input is not an AWS S3 URL (e.g. data URI or empty), it resolves gracefully.
 *
 * @param fileUrlOrKey The public AWS S3 URL or key to delete
 * @returns boolean indicating success
 */
export const deleteImageFromAWS = async (fileUrlOrKey: string): Promise<boolean> => {
  if (!fileUrlOrKey || typeof fileUrlOrKey !== "string") return false;

  // If local base64 or blob, nothing on S3 to delete
  if (fileUrlOrKey.startsWith("data:") || fileUrlOrKey.startsWith("blob:")) {
    return true;
  }

  try {
    const response = await apiClient.delete<{
      status: boolean;
      message: string;
    }>("/upload", {
      data: { fileUrl: fileUrlOrKey },
    });
    return response.data?.status ?? false;
  } catch (error) {
    console.error("Failed to delete image from AWS:", error);
    return false;
  }
};

export default uploadImageToAWS;
