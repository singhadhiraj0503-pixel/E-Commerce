import mongoose, { model, Schema, Types } from "mongoose";
const cartItemSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    color: {
        type: String,
        trim: true,
    },
    size: {
        type: String,
        enum: ["S", "M", "L", "XL"],
    },
}, { _id: false });
const CartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: {
        type: [cartItemSchema],
        default: [],
    },
}, { timestamps: true });
export const Cart = mongoose.models.Cart ??
    model("Cart", CartSchema);
//# sourceMappingURL=Cart.js.map