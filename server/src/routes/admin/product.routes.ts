import express from "express";
import { requireAdmin } from "../../middleware/auth.js";
import {
  editProducts,
  fetchProductById,
  fetchProducts,
  getCategories,
  postCategories,
  postProducts,
  updateCategories,
} from "../../controllers/admin/admin-product.controller.js";
import multer from "multer";

export const adminProductRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
    files: 10,
  },
});

adminProductRouter.use(requireAdmin);

// Get categories
adminProductRouter.get("/categories", getCategories);

// Post categories
adminProductRouter.post("/categories", postCategories);

// Update categories
adminProductRouter.put("/categories/:id", updateCategories);

// Fetch products
adminProductRouter.get("/products", fetchProducts);

// Fetch Specific product
adminProductRouter.get("/products/:id", fetchProductById);

// Post products
adminProductRouter.post("/products", upload.array("images", 10), postProducts);

// Edit products
adminProductRouter.put(
  "/products/:id",
  upload.array("images", 10),
  editProducts,
);
