import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDB } from "./db.js";
import morgan from "morgan";
import { ok } from "./utils/envelope.js";
import { notFOund } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { clerkMiddleware } from "@clerk/express";
import authRouter from "./routes/auth/auth.route.js";

const mainEntryFunction = async () => {
  await connectToDB();

  const app = express();
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
  app.use(clerkMiddleware());

  app.get("/health", (req, res) => {
    res
      .status(200)
      .json(ok({ message: "Server is healthy and running in healthy state" }));
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
