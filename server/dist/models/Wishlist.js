import mongoose, { model, Schema } from "mongoose";
const wishlistSchema = new mongoose.Schema({
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
}, { timestamps: true });
export const Wishlist = mongoose.models.Wishlist ??
    model("Wishlist", wishlistSchema);
//# sourceMappingURL=Wishlist.js.map