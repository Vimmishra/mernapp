
/*

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer, folder = "videos") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload failed:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
*/


import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {String} folder - Folder to store file in Cloudinary.
 * @param {String} resourceType - 'video' or 'image'
 * @returns {Promise<Object>} - Cloudinary upload result.
 */
export const uploadToCloudinary = (fileBuffer, folder = "videos", resourceType = "video") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
      },
      (error, result) => {
        if (error) {
          console.error(`❌ Cloudinary ${resourceType} upload failed:`, error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
