import express from "express";
import { requireAdmin } from "../../middleware/auth.js";
import {
  deletePromo,
  getPromos,
  postPromos,
  updatePromo,
} from "../../controllers/admin/admin-promo.controller.js";

export const adminPromoRouter = express.Router();

adminPromoRouter.use(requireAdmin);

// get all the promos
adminPromoRouter.get("/promos", getPromos);

// post promo
adminPromoRouter.post("/promo", postPromos);

// update promo
adminPromoRouter.patch("/promo/:promoId", updatePromo);

// delete promo
adminPromoRouter.delete("/promo/:promoId", deletePromo);
