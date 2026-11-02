import express from "express";
import type { Types } from "mongoose";
import { getCustomerHomeRoute } from "../../controllers/customer/home.controller.js";

export const customerHomeRouter = express.Router();

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

// fetch customer home route items
customerHomeRouter.get("/home", getCustomerHomeRoute);
