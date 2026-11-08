import mongoose, { Types, type HydratedDocument } from "mongoose";
export type ProductImage = {
    url: string;
    publicId: string;
    isCover: boolean;
};
export type ProductSize = "S" | "M" | "L" | "XL";
export type ProductStatus = "active" | "inactive";
export type Product = {
    title: string;
    description: string;
    category: Types.ObjectId;
    brand: string;
    stock: number;
    images: ProductImage[];
    colors: string[];
    sizes: ProductSize[];
    price: number;
    salePercentage: number;
    status: ProductStatus;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};
export type ProductDocument = HydratedDocument<Product>;
export declare const Product: mongoose.Model<any>;
//# sourceMappingURL=Product.d.ts.map