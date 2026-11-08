import type { Types } from "mongoose";
import type { OrderStatus, PaymentStatus } from "../../models/Order.js";
export declare const ALLOWED_ORDER_STATUSES: readonly ["placed", "shipped", "delivered", "returned"];
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
export declare const adminOrderRouter: import("express-serve-static-core").Router;
//# sourceMappingURL=orders.routes.d.ts.map