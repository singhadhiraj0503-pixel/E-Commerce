import express from "express";
import { requireAdmin } from "../../middleware/auth.js";
import { getAllAdminOrders, updateAdminOrderStatus, } from "../../controllers/admin/admin-orders.controller.js";
export const ALLOWED_ORDER_STATUSES = [
    "placed",
    "shipped",
    "delivered",
    "returned",
];
export const adminOrderRouter = express.Router();
adminOrderRouter.use(requireAdmin);
// get all orders
adminOrderRouter.get("/orders", getAllAdminOrders);
// update admin orders status
adminOrderRouter.patch("/orders/:orderId/status", updateAdminOrderStatus);
//# sourceMappingURL=orders.routes.js.map