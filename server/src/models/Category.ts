import mongoose, { Model } from "mongoose";

interface CategoryFields {
  name: string;
}

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
  mongoose.model<CategoryFields>("Category", categorySchema);
