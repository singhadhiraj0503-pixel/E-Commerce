import type { HydratedDocument } from "mongoose";
import type { CartFields } from "../types/types.js";
import mongoose, { Types } from "mongoose";
export type CartDocument = HydratedDocument<CartFields>;
export declare const Cart: mongoose.Model<CartFields, {}, {}, {}, mongoose.Document<unknown, {}, CartFields, {}, mongoose.DefaultSchemaOptions> & CartFields & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, CartFields & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Cart.d.ts.map