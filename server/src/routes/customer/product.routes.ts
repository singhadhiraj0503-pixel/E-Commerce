import express from "express";
import {
  getAllListedProducts,
  getProductByCategories,
  getProductDetails,
} from "../../controllers/customer/product.controller.js";

export const customerProductRouter = express.Router();

// Fetching products by categories
customerProductRouter.get("/categories", getProductByCategories);

// Fetch list of products
customerProductRouter.get("/products", getAllListedProducts);

// Product details page
customerProductRouter.get("/products/:id", getProductDetails);
