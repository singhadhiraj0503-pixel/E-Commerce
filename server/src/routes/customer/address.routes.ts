import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  deleteAddress,
  editAddress,
  getAddress,
  postAddress,
} from "../../controllers/customer/address.controller.js";

export const customerAddressRouter = express.Router();

customerAddressRouter.use(requireAuth);

// Get addresses
customerAddressRouter.get("/address", getAddress);

// Post addresses
customerAddressRouter.post("/address", postAddress);

// Edit addresses
customerAddressRouter.patch("/address/:addressId", editAddress);

// Delete addresses
customerAddressRouter.delete("/address/:addressId", deleteAddress);
