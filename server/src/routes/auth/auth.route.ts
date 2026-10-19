import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import {
  getUserController,
  syncUserToDbController,
} from "../../controllers/user/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/sync", requireAuth, syncUserToDbController);

authRouter.get("/me", requireAuth, getUserController);

export default authRouter;
