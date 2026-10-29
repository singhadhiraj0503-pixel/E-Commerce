import type { HydratedDocument } from "mongoose";

import mongoose, { model, Schema } from "mongoose";
import type { WishlistField } from "../types/types.js";

export type WishlistDocument = HydratedDocument<WishlistField>;

const wishlistSchema = new mongoose.Schema<WishlistField>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const Wishlist =
  (mongoose.models.Cart as mongoose.Model<WishlistField> | undefined) ??
  model<WishlistField>("Wishlist", wishlistSchema);
