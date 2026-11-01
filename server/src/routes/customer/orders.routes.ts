import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  getAllOrders,
  returnOrder,
} from "../../controllers/customer/orders.controller.js";

export const customerOrderRouter = express.Router();

customerOrderRouter.use(requireAuth);

// Get all the orders
customerOrderRouter.get("/orders", getAllOrders);

// Return orders
customerOrderRouter.patch("/orders/:orderId/return", returnOrder);
