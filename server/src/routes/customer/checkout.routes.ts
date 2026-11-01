import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  checkoutCreateSession,
  confirmCheckout,
} from "../../controllers/customer/checkout.controller.js";

export const customerCheckoutRouter = express.Router();

customerCheckoutRouter.use(requireAuth);

// Create-Session checkout
customerCheckoutRouter.post("/checkout/create-session", checkoutCreateSession);

// Confirm checkout
customerCheckoutRouter.post("/checkout/confirm", confirmCheckout);
