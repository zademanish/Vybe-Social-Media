import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOncloudinary = async (file) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    // ✅ Remove local file safely
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return result.secure_url;
  } catch (error) {
    // ✅ Still try to clean up if upload fails
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export default uploadOncloudinary;

