import { Banner } from "../../models/Banner.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ok } from "../../utils/envelope.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { AppError } from "../../utils/AppError.js";
import { uploadManyBuffersToCloudinary } from "../../utils/cloudinary.js";
function mapBanner(item) {
    return {
        _id: String(item._id),
        imageUrl: item.imageUrl,
        imagePublicId: item.imagePublicId,
        createdAt: item.createdAt.toISOString(),
    };
}
const BANNER_FOLDER = "e-commerce/banners";
export const getBannerImages = asyncHandler(async (req, res) => {
    const items = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(ok({ items: items.map(mapBanner) }));
});
export const uploadBannerImages = asyncHandler(async (req, res) => {
    const dbUser = await getDbUserFromReq(req);
    const files = (req.files || []);
    if (!files.length) {
        throw new AppError(400, "At least one image is required");
    }
    const uploadedImages = await uploadManyBuffersToCloudinary(files.map((file) => file.buffer), BANNER_FOLDER);
    const createFinalBanners = await Banner.insertMany(uploadedImages.map((item) => ({
        imageUrl: item.url,
        imagePublicId: item.publicId,
        createdBy: dbUser._id,
    })));
    res.status(201).json(ok({ items: createFinalBanners.map(mapBanner) }));
});
//# sourceMappingURL=admin-settings.controller.js.map