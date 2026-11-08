import type { HydratedDocument, Types } from "mongoose";
import mongoose from "mongoose";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "placed" | "shipped" | "delivered" | "returned";
export type OrderItem = {
    product: Types.ObjectId;
    quantity: number;
};
export type Order = {
    user: Types.ObjectId;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalItems: number;
    deliveryName: string;
    deliveryAddress: string;
    promoCode?: string;
    discountAmount: number;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    razorpayOrderId: string;
    paymentId?: string;
    paidAt?: Date | null;
    deliveredAt?: Date | null;
    returnedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
};
export type OrderDocument = HydratedDocument<Order>;
export declare const Order: mongoose.Model<any, {}, {}, {}, any, any, any> | mongoose.Model<Order, {}, {}, {}, mongoose.Document<unknown, {}, Order, {}, mongoose.DefaultSchemaOptions> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Order.d.ts.map