import { getAuth } from "@clerk/express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../models/User.js";
import { ok } from "../../utils/envelope.js";

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
