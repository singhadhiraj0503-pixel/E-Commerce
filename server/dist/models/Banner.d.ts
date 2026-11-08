import type { HydratedDocument, Types } from "mongoose";
import mongoose from "mongoose";
export type BannerItem = {
    imageUrl: string;
    imagePublicId: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};
export type BannerDocument = HydratedDocument<BannerItem>;
export declare const Banner: mongoose.Model<any, {}, {}, {}, any, any, any> | mongoose.Model<BannerItem, {}, {}, {}, mongoose.Document<unknown, {}, BannerItem, {}, mongoose.DefaultSchemaOptions> & BannerItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, BannerItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Banner.d.ts.map