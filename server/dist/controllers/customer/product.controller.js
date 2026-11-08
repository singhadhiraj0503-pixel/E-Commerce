import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../models/Category.js";
import { ok } from "../../utils/envelope.js";
import { Product } from "../../models/Product.js";
import { requireFound } from "../../utils/helpers.js";
export const getProductByCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json(ok(categories));
});
export const getAllListedProducts = asyncHandler(async (req, res) => {
    const category = (req.query.category || "").trim();
    const brand = (req.query.brand || "").trim();
    const color = (req.query.color || "").trim();
    const size = (req.query.size || "").trim();
    const sort = req.query.sort || "recent";
    const query = {
        status: "active",
    };
    if (category) {
        query.category = category;
    }
    if (brand) {
        query.brand = brand;
    }
    if (color) {
        query.colors = color;
    }
    if (size) {
        query.sizes = size;
    }
    let sortOption = { createdAt: -1 };
    if (sort === "price-low") {
        sortOption = { price: 1 };
    }
    if (sort === "price-high") {
        sortOption = { price: -1 };
    }
    const products = await Product.find(query)
        .populate("category", "name")
        .sort(sortOption);
    res.status(200).json(ok(products));
});
export const getProductDetails = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findOne({
        _id: productId,
        status: "active",
    }).populate("category", "name");
    const foundProduct = requireFound(product, "Product not found");
    const relatedProducts = await Product.find({
        _id: { $ne: foundProduct._id },
        category: foundProduct.category,
        status: "active",
    })
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .limit(4);
    res.status(200).json(ok({ product: foundProduct, relatedProducts }));
});
//# sourceMappingURL=product.controller.js.map