import mongoose, { Model, type HydratedDocument } from "mongoose";

interface CategoryFields {
  name: string;
}

export type Category = {
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryDocument = HydratedDocument<Category>;

const categorySchema = new mongoose.Schema<CategoryFields>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Category: Model<CategoryFields> =
  (mongoose.models.Category as Model<CategoryFields> | undefined) ??
  mongoose.model<CategoryFields | Category>("Category", categorySchema);
