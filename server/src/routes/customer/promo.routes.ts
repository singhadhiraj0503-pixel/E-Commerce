import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import { applyPromo } from "../../controllers/customer/promo.controller.js";

export const customerPromoRouter = express.Router();

customerPromoRouter.use(requireAuth);

customerPromoRouter.post("/promo/apply", applyPromo);
