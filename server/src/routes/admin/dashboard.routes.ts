import express from "express";
import { requireAdmin } from "../../middleware/auth.js";
import { getAdminDashboardItems } from "../../controllers/admin/admin-dashboard.controller.js";

export const adminDashboardRouter = express.Router();

adminDashboardRouter.use(requireAdmin);

// get admin dashboard items
adminDashboardRouter.get("/dashboard/lite", getAdminDashboardItems);
