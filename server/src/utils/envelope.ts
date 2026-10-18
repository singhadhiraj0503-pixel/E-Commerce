// export type ApiEnvelope<T> = {
//   status: "success" | "error";
//   data: T | null;
//   meta?: Record<string, unknown>;
//   errors?: Array<{ message: string; code?: string }>;
// };

// export const ok = <T>(
//   data: T,
//   meta?: Record<string, unknown>,
// ): ApiEnvelope<T> => {
//   return { status: "success", data, meta };
// };

// export const fail = (message: string, code?: string): ApiEnvelope<null> => {
//   return { status: "error", data: null, errors: [{ message, code }] };
// };

export type ApiEnvelope<T> = {
  status: "success" | "error";
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: Array<{ message: string; code?: string }>;
};

export const ok = <T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiEnvelope<T> => {
  return {
    status: "success",
    data,
    ...(meta !== undefined ? { meta } : {}),
  };
};

export const fail = (message: string, code?: string): ApiEnvelope<null> => {
  return {
    status: "error",
    data: null,
    errors: [
      {
        message,
        ...(code !== undefined ? { code } : {}),
      },
    ],
  };
};
