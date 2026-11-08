import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "../../models/Product.js";
import { Category } from "../../models/Category.js";
import { Order } from "../../models/Order.js";
import { ok } from "../../utils/envelope.js";
export const getAdminDashboardItems = asyncHandler(async (req, res) => {
    const [totalProducts, totalCategories, totalOrders, totalReturnedOrders, salesRows,] = await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: "returned" }),
        Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
        ]),
    ]);
    res.status(200).json(ok({
        totalProducts,
        totalCategories,
        totalSales: salesRows[0]?.totalSales || 0,
        totalOrders,
        totalReturnedOrders,
    }));
});
//# sourceMappingURL=admin-dashboard.controller.js.map