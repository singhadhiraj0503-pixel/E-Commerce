import type { HydratedDocument, Types } from "mongoose";
import type { UserRole } from "../models/User.js";
import type { ProductSize } from "../models/Product.js";

export interface Address {
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UserDocument {
  clerkUserId: string;
  name?: string;
  email?: string;
  role: UserRole;
  points: number;
  addresses: Address[];
}

export type UploadedImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};

export type CartItem = {
  product: Types.ObjectId;
  quantity: number;
  color?: string;
  size?: ProductSize;
};

export type CartFields = {
  user: Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type WishlistField = {
  user: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductSort = "recent" | "price-low" | "price-high";

export type ProductAppliedFilterListQuery = {
  category?: string;
  brand?: string;
  color?: string;
  size?: string;
  sort?: ProductSort;
};

export type AddressItem = {
  _id?: string;
  fullName: string;
  address: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
};

export type PromoDbItem = {
  _id?: Types.ObjectId;
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
  startsAt: Date;
  endsAt: Date;
  createdAt?: Date;
};
