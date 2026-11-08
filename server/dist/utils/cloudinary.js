import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadSingleBufferToCloudinary = (fileBuffer, folder = "Monster-E-Commerce/products") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("Cloudinary Upload Failed"));
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
            });
        });
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};
export const uploadManyBuffersToCloudinary = async (files, folder = "Monster-E-Commerce/products") => {
    return Promise.all(files.map((file) => uploadSingleBufferToCloudinary(file, folder)));
};
//# sourceMappingURL=cloudinary.js.map