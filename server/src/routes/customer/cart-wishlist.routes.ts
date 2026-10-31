import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  cartSync,
  decreaseCartItem,
  deleteCartItem,
  deleteWishlist,
  getCartItems,
  getWishlist,
  increaseCartItem,
  postCartItems,
  postWishlist,
} from "../../controllers/customer/cart-wishlist.controller.js";

export const customerCartWishlistRouter = express.Router();

customerCartWishlistRouter.use(requireAuth);

// Get cart
customerCartWishlistRouter.get("/cart", getCartItems);

// Post cart
customerCartWishlistRouter.post("/cart/items", postCartItems);

// Increment Cart quantity
customerCartWishlistRouter.patch(
  "/cart/items/:productId/increase",
  increaseCartItem,
);

// Decrease Cart quantity
customerCartWishlistRouter.patch(
  "/cart/items/:productId/decrease",
  decreaseCartItem,
);

// Delete cart item
customerCartWishlistRouter.delete("/cart/items/:productId", deleteCartItem);

// Cart sync
customerCartWishlistRouter.post("/cart/sync", cartSync);

// Get Wishlist
customerCartWishlistRouter.get("/wishlist", getWishlist);

// Post Wishlist
customerCartWishlistRouter.post("/wishlist/items", postWishlist);

// Delete Wishlist
customerCartWishlistRouter.delete("/wishlist/items/:productId", deleteWishlist);
