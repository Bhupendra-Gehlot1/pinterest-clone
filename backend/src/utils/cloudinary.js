import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File has been uploaded succesfully", uploadResult.url);
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove locally saved temporary file as the upload operations failed
    return null;
  }
};

const deleteFromCloudinary = async (fileId) => {
  try {
    const uploadResult = await cloudinary.uploader.destroy(fileId);
    return uploadResult
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary , deleteFromCloudinary};
