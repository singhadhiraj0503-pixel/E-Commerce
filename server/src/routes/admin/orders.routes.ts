import express from "express";
import type { Types } from "mongoose";
import type { OrderStatus, PaymentStatus } from "../../models/Order.js";
import { requireAdmin } from "../../middleware/auth.js";
import {
  getAllAdminOrders,
  updateAdminOrderStatus,
} from "../../controllers/admin/admin-orders.controller.js";

export const ALLOWED_ORDER_STATUSES = [
  "placed",
  "shipped",
  "delivered",
  "returned",
] as const;

export type AdminOrderStatus = (typeof ALLOWED_ORDER_STATUSES)[number];

export type AdminOrderRow = {
  _id: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  totalItems: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paidAt?: Date | null;
  deliveredAt?: Date | null;
  returnedAt?: Date | null;
  createdAt: Date;
};

export const adminOrderRouter = express.Router();

adminOrderRouter.use(requireAdmin);

// get all orders
adminOrderRouter.get("/orders", getAllAdminOrders);

// update admin orders status
adminOrderRouter.patch("/orders/:orderId/status", updateAdminOrderStatus);
