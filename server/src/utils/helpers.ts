import { AppError } from "./AppError.js";

export const requireText = (
  value: unknown,
  message: string,
  statusCode = 400,
) => {
  if (!String(value || "").trim()) {
    throw new AppError(statusCode, message);
  }
};

export const requireNumber = (
  value: unknown,
  message: string,
  statusCode = 400,
) => {
  if (Number.isNaN(value)) {
    throw new AppError(statusCode, message);
  }
};

export const requireFound = <T>(
  value: T | null | undefined,
  message: string,
  statusCode = 404,
): T => {
  if (!value) {
    throw new AppError(statusCode, message);
  }

  return value;
};
