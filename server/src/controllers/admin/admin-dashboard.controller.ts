import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "../../models/Product.js";
import { Category } from "../../models/Category.js";
import { Order } from "../../models/Order.js";
import type { TotalSaleRow } from "../../types/types.js";
import { ok } from "../../utils/envelope.js";

export const getAdminDashboardItems = asyncHandler(
  async (req: Request, res: Response) => {
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalReturnedOrders,
      salesRows,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "returned" }),
      Order.aggregate<TotalSaleRow>([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
      ]),
    ]);

    res.status(200).json(
      ok({
        totalProducts,
        totalCategories,
        totalSales: salesRows[0]?.totalSales || 0,
        totalOrders,
        totalReturnedOrders,
      }),
    );
  },
);
