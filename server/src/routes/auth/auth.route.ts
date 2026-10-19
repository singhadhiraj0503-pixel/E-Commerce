import express from "express";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { clerkClient, getAuth } from "@clerk/express";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../models/User.js";
import { ok } from "../../utils/envelope.js";
import { getUserController } from "../../controllers/user/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
  "/sync",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = await getAuth(req);
    if (!userId) {
      throw new AppError(
        401,
        "User not logged in. Means the user is unauthenticated!",
      );
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const extractEmailFromUserInfo =
      clerkUser.emailAddresses.find(
        (item) => item.id === clerkUser.primaryEmailAddressId,
      ) || clerkUser.emailAddresses[0];

    const email = extractEmailFromUserInfo?.emailAddress;
    const fullName = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const name = fullName || clerkUser.username;
    const raw = process.env.ADMIN_EMAILS || "";
    const adminEmails = new Set(
      raw
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    );

    // if the current user is existing or not
    // update or do nothing
    // if not create the user and save it in out database with role
    const exisitingUser = await User.findOne({ clerkUserId: userId });
    const shouldBeAdmin = email ? adminEmails.has(email.toLowerCase()) : false;
    const nextRole =
      exisitingUser?.role === "admin"
        ? "admin"
        : shouldBeAdmin
          ? "admin"
          : exisitingUser?.role || "user";

    const newlyCreatedDbUser = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { clerkUserId: userId, email, name, role: nextRole },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json(
      ok({
        user: {
          id: newlyCreatedDbUser._id,
          clerkUserId: newlyCreatedDbUser.clerkUserId,
          email: newlyCreatedDbUser.email,
          name: newlyCreatedDbUser.name,
          role: newlyCreatedDbUser.role,
        },
      }),
    );
  }),
);

authRouter.get("/me", requireAuth, getUserController);

export default authRouter;
