import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requireText } from "../../utils/helpers.js";
import { AppError } from "../../utils/AppError.js";
import { Promo } from "../../models/Promo.js";
import { ok } from "../../utils/envelope.js";

export const applyPromo = asyncHandler(async (req: Request, res: Response) => {
  const code = String(req.body.code || "")
    .trim()
    .toUpperCase();

  const orderValue = Number(req.body.orderValue || 0);

  requireText(code, "Promo Code is required");
  if (Number.isNaN(orderValue || orderValue < 0)) {
    throw new AppError(400, "Valid Order Value is required");
  }

  const promo = await Promo.findOne({ code });
  if (!promo) {
    throw new AppError(404, "Promo not found");
  }

  const now = new Date();
  if (now < promo.startsAt) {
    throw new AppError(400, "Promo code is not activated");
  }

  if (now > promo.endsAt) {
    throw new AppError(400, "Promo code is expired");
  }

  if (promo.count < 1) {
    throw new AppError(400, "Promo code limit is already exceeded");
  }

  if (orderValue < promo.minimumOrderValue) {
    throw new AppError(
      400,
      `Minimum order value for this promo is ${promo.minimumOrderValue}`,
    );
  }

  res.status(201).json(
    ok({
      code: promo.code,
      percentage: promo.percentage,
      count: promo.count,
      minimumOrderValue: promo.minimumOrderValue,
    }),
  );
});
