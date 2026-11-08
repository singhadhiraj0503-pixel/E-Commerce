import type { Types } from "mongoose";
export declare const customerHomeRouter: import("express-serve-static-core").Router;
export type ProductRow = {
    _id: Types.ObjectId;
    title: string;
    brand: string;
    price: number;
    salePercentage: number;
    images: Array<{
        url: string;
        isCover?: boolean;
    }>;
    createdAt: Date;
};
export type PromoRow = {
    _id: Types.ObjectId;
    code: string;
    percentage: number;
    count: number;
    minimumOrderValue: number;
    endsAt: Date;
};
//# sourceMappingURL=home.routes.d.ts.map