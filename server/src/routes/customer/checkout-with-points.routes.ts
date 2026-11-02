import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  checkUserPoints,
  payWithPointsCheckout,
} from "../../controllers/customer/checkout-with-points.controller.js";

export const customerCheckoutWithPointsRouter = express.Router();

customerCheckoutWithPointsRouter.use(requireAuth);

// Check whether user have points or not
customerCheckoutWithPointsRouter.get("/checkout/points", checkUserPoints);

// Pay with points checkout
customerCheckoutWithPointsRouter.post(
  "/checkout/pay-with-points",
  payWithPointsCheckout,
);
