import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return next(
      new AppError(401, "User is not Logged in. / Means unauth user!"),
    );
  }

  next();
};

export const getDbUserFromReq = async (req: Request) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new AppError(
      401,
      "User is not logged in. / Means the user is unauthenticatd!",
    );
  }

  const dbUser = await User.findOne({ clerkUserId: userId });
  if (!dbUser) {
    throw new AppError(404, "User is not found in the database!");
  }

  return dbUser;
};

// admin gate
// user logged in + admin access
export const requireAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const extractCurrentDbUser = await getDbUserFromReq(req);
    if (extractCurrentDbUser.role !== "admin") {
      throw new AppError(403, "Admin access only");
    }
    next();
  },
);
