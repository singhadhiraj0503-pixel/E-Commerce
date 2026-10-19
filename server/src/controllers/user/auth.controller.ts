import { clerkClient, getAuth } from "@clerk/express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../models/User.js";
import { ok } from "../../utils/envelope.js";

export const syncUserToDbController = asyncHandler(async (req, res) => {
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
});

export const getUserController = asyncHandler(async (req, res) => {
  const { userId } = await getAuth(req);
  if (!userId) {
    throw new AppError(
      401,
      "User not logged in. Means the user is unauthenticaed!",
    );
  }

  const dbUser = await User.findOne({ clerkUserId: userId });
  if (!dbUser) {
    throw new AppError(404, "User not found in the database");
  }

  res.status(200).json(
    ok({
      user: {
        id: dbUser._id,
        clerkUserId: dbUser.clerkUserId,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      },
    }),
  );
});
