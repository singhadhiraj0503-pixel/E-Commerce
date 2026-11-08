// export type ApiEnvelope<T> = {
//   status: "success" | "error";
//   data: T | null;
//   meta?: Record<string, unknown>;
//   errors?: Array<{ message: string; code?: string }>;
// };
export const ok = (data, meta) => {
    return {
        status: "success",
        data,
        ...(meta !== undefined ? { meta } : {}),
    };
};
export const fail = (message, code) => {
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
//# sourceMappingURL=envelope.js.map