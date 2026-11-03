import express from "express";
import { requireAdmin } from "../../middleware/auth.js";
import {
  getBannerImages,
  uploadBannerImages,
} from "../../controllers/admin/admin-settings.controller.js";
import multer from "multer";

export const adminSettingsRouter = express.Router();

adminSettingsRouter.use(requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
    files: 10,
  },
});

// fetch banner images
adminSettingsRouter.get("/settings/banners", getBannerImages);

// upload banner images
adminSettingsRouter.post(
  "/settings/banners",
  upload.array("images", 10),
  uploadBannerImages,
);
