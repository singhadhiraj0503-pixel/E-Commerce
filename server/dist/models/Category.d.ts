import { Model, type HydratedDocument } from "mongoose";
interface CategoryFields {
    name: string;
}
export type Category = {
    name: string;
    createdAt: Date;
    updatedAt: Date;
};
export type CategoryDocument = HydratedDocument<Category>;
export declare const Category: Model<CategoryFields>;
export {};
//# sourceMappingURL=Category.d.ts.map