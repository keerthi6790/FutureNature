import { uploadImageToAWS, deleteImageFromAWS } from "@/utils/uploadToAws";

export { uploadImageToAWS, deleteImageFromAWS };

export const uploadApi = {
  uploadImage: uploadImageToAWS,
  deleteImage: deleteImageFromAWS,
};

export default uploadApi;
