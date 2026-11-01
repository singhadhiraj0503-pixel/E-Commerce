import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { requireFound, requireText } from "../../utils/helpers.js";
import { User } from "../../models/User.js";
import type {
  CartRow,
  CheckoutUserRow,
  ProductRow,
  PromoRow,
} from "../../types/types.js";
import { Cart } from "../../models/Cart.js";
import { AppError } from "../../utils/AppError.js";
import { Product } from "../../models/Product.js";
import { Promo } from "../../models/Promo.js";
import { razorpay, toSubUnits } from "../../utils/razorpay.js";
import { Order } from "../../models/Order.js";
import { ok } from "../../utils/envelope.js";
import crypto from "crypto";

export const checkoutCreateSession = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.body.addressId || "").trim();
    const promoCode = String(req.body.promoCode || "")
      .trim()
      .toUpperCase();

    requireText(addressId, "Address ID is required");

    // get user and cart information
    const [user, cart] = await Promise.all([
      User.findById(dbUser._id)
        .select("name email addresses")
        .lean<CheckoutUserRow | null>(),

      Cart.findOne({ user: dbUser._id }).select("items").lean<CartRow | null>(),
    ]);

    const foundUser = requireFound(user, "User not found", 404);
    const foundCart = requireFound(cart, "Cart not found", 404);

    if (!foundCart.items.length) {
      throw new AppError(400, "Cart is empty");
    }

    const selectedAddress = foundUser.addresses.find(
      (item) => String(item._id) === addressId,
    );
    if (!selectedAddress) {
      throw new AppError(400, "Address not found!!");
    }

    const products = await Product.find({
      _id: { $in: foundCart.items.map((item) => item.product) },
    })
      .select("price salePercentage stock status")
      .lean<ProductRow[]>();

    const productMap = new Map(
      products.map((item) => [String(item._id), item]),
    );

    let totalItems = 0;
    let subTotal = 0;

    const items = foundCart.items.map((cartItem) => {
      const product = productMap.get(String(cartItem.product));

      if (!product || product.status !== "active") {
        throw new AppError(400, "One or more cart items are not available");
      }

      if (product.stock < cartItem.quantity) {
        throw new AppError(400, "Cart items are out of stock");
      }

      const finalPrice = product.salePercentage
        ? Math.round(
            product.price - (product.price * product.salePercentage) / 100,
          )
        : product.price;

      totalItems += cartItem.quantity;
      subTotal += finalPrice * cartItem.quantity;

      return {
        product: cartItem.product,
        quantity: cartItem.quantity,
      };
    });

    let appliedPromoCode = "";
    let discountAmount = 0;

    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode })
        .select("code percentage count minimumOrderValue startsAt endsAt")
        .lean<PromoRow | null>();

      const foundPromo = requireFound(promo, "Promo not found", 404);
      const now = new Date();

      if (
        now < foundPromo.startsAt ||
        now > foundPromo.endsAt ||
        foundPromo.count < 1
      ) {
        throw new AppError(400, "Promo code is not active");
      }

      if (subTotal < foundPromo.minimumOrderValue) {
        throw new AppError(
          400,
          "Minimum order value for this promo is not at the threesold",
        );
      }

      appliedPromoCode = foundPromo.code;
      discountAmount = Math.round((subTotal * foundPromo.percentage) / 100);
    }

    const totalAmount = Math.max(subTotal - discountAmount, 0);
    const razorpayOrder = await razorpay.orders.create({
      amount: toSubUnits(totalAmount),
      currency: "INR",
      receipt: `Order_${Date.now()}`,
    });

    const deliveryAddress = [
      selectedAddress.address,
      selectedAddress.state,
      selectedAddress.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const order = await Order.create({
      user: dbUser._id,
      customerName: foundUser.name || selectedAddress.fullName,
      customerEmail: foundUser.email || "",
      items,
      totalItems,
      deliveryName: selectedAddress.fullName,
      deliveryAddress,
      promoCode: appliedPromoCode,
      discountAmount,
      totalAmount,
      paymentStatus: "pending",
      orderStatus: "placed",
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(200).json(
      ok({
        razorpay: {
          keyId: process.env.RAZORPAY_KEY_ID,
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        order: {
          _id: String(order?._id),
          totalItems,
          discountAmount,
          totalAmount,
        },
      }),
    );
  },
);

export const confirmCheckout = asyncHandler(
  async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const orderId = String(req.body.orderId || "").trim();
    const razorpayPaymentId = String(req.body.razorpay_payment_id || "").trim();
    const razorpayOrderId = String(req.body.razorpay_order_id || "").trim();
    const razorpaySignature = String(req.body.razorpay_signature || "").trim();

    requireText(orderId, "Order id is needed");
    requireText(razorpayPaymentId, "razorpayPaymentId is needed");
    requireText(razorpayOrderId, "razorpayOrderId is needed");
    requireText(razorpaySignature, "razorpaySignature is needed");

    const order = await Order.findOne({
      _id: orderId,
      user: dbUser._id,
    } as any);
    const foundOrder = requireFound(order, "Order not found", 404);

    if (foundOrder.paymentStatus === "paid") {
      res.status(200).json(ok({ _id: String(foundOrder._id) }));
      return;
    }

    if (foundOrder.razorpayOrderId !== razorpayOrderId) {
      throw new AppError(400, "Order ID mismatched");
    }

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (signature !== razorpaySignature) {
      throw new AppError(400, "Invalid payment signature");
    }

    for (const item of foundOrder.items) {
      const updated = await Product.updateOne(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
      );

      if (!updated.matchedCount) {
        throw new AppError(400, "One or more cart items are out of stock");
      }
    }

    if (foundOrder.promoCode) {
      await Promo.updateOne(
        {
          code: foundOrder.promoCode,
          count: { $gt: 0 },
        },
        {
          $inc: { count: -1 },
        },
      );
    }

    await Cart.updateOne({ user: dbUser._id }, { $set: { items: [] } });

    foundOrder.paymentStatus = "paid";
    foundOrder.paymentId = razorpayPaymentId;
    foundOrder.paidAt = new Date();
    await foundOrder.save();

    res.status(201).json(ok({ _id: String(foundOrder._id) }));
  },
);
