import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDB } from "./db.js";
import morgan from "morgan";
import { ok } from "./utils/envelope.js";
import { notFOund } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { clerkMiddleware, getAuth } from "@clerk/express";
import authRouter from "./routes/auth/auth.route.js";

const mainEntryFunction = async () => {
  await connectToDB();

  const app = express();

  console.log("Clerk backend configuration:", {
    hasPublishableKey: Boolean(process.env.CLERK_PUBLISHABLE_KEY),
    hasSecretKey: Boolean(process.env.CLERK_SECRET_KEY),
    publishableKeyPrefix: process.env.CLERK_PUBLISHABLE_KEY?.slice(0, 8),
    debug: true,
  });

  // app.use(clerkMiddleware());
  app.use(clerkMiddleware({ debug: true }));

  const corsOrigin = (process.env.CORS_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res
      .status(200)
      .json(ok({ message: "Server is healthy and running in healthy state" }));
  });

  // Temporary diagnostic endpoint — remove after testing.
  app.get("/debug/clerk-auth", (req, res) => {
    const auth = getAuth(req);

    res.json({
      hasAuthorizationHeader: Boolean(req.headers.authorization),
      isAuthenticated: auth.isAuthenticated,
      hasUserId: Boolean(auth.userId),
      hasSessionId: Boolean(auth.sessionId),
    });
  });

  app.use("/api/auth", authRouter);

  app.use(notFOund);
  app.use(errorHandler);

  const port = Number(process.env.PORT || 3000);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

mainEntryFunction().catch((err) => {
  console.error("Failed to start the server", err);
  process.exit(1);
});
