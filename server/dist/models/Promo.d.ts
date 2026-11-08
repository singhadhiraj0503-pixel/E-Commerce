import type { HydratedDocument } from "mongoose";
import mongoose from "mongoose";
export type Promo = {
    code: string;
    percentage: number;
    count: number;
    minimumOrderValue: number;
    startsAt: Date;
    endsAt: Date;
    createdAt: Date;
    updatedAt: Date;
};
export type PromoDocument = HydratedDocument<Promo>;
export declare const Promo: mongoose.Model<Promo, {}, {}, {}, mongoose.Document<unknown, {}, Promo, {}, mongoose.DefaultSchemaOptions> & Promo & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Promo & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Promo.d.ts.map