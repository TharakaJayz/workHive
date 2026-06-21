"use server";

import { v2 as cloudinary } from "cloudinary";

// Ensure environment variables are loaded
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function uploadPDFAction(formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) {
      throw new Error("No file uploaded or file is empty.");
    }

    // Convert file representation to server binary buffer stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Crucial structural configuration for PDFs
          folder: "workhive_resumes",
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      ).end(buffer);
    }) as any;

    return uploadResult.secure_url;
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error.message || "Failed to upload file to Cloudinary");
  }
}