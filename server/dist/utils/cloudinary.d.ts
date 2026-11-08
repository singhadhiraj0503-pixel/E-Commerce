type CloudinaryUploadResult = {
    url: string;
    publicId: string;
};
export declare const uploadSingleBufferToCloudinary: (fileBuffer: Buffer, folder?: string) => Promise<CloudinaryUploadResult>;
export declare const uploadManyBuffersToCloudinary: (files: Buffer[], folder?: string) => Promise<CloudinaryUploadResult[]>;
export {};
//# sourceMappingURL=cloudinary.d.ts.map