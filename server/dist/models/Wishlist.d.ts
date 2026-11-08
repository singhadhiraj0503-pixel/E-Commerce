import type { HydratedDocument } from "mongoose";
import mongoose from "mongoose";
import type { WishlistField } from "../types/types.js";
export type WishlistDocument = HydratedDocument<WishlistField>;
export declare const Wishlist: mongoose.Model<WishlistField, {}, {}, {}, mongoose.Document<unknown, {}, WishlistField, {}, mongoose.DefaultSchemaOptions> & WishlistField & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, WishlistField & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Wishlist.d.ts.map