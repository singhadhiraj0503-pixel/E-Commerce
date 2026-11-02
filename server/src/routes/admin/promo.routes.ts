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
adminPromoRouter.post("/promos", postPromos);

// update promo
adminPromoRouter.patch("/promos/:promoId", updatePromo);

// delete promo
adminPromoRouter.delete("/promos/:promoId", deletePromo);
