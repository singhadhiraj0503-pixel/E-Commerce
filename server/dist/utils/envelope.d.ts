export type ApiEnvelope<T> = {
    status: "success" | "error";
    data: T | null;
    meta?: Record<string, unknown>;
    errors?: Array<{
        message: string;
        code?: string;
    }>;
};
export declare const ok: <T>(data: T, meta?: Record<string, unknown>) => ApiEnvelope<T>;
export declare const fail: (message: string, code?: string) => ApiEnvelope<null>;
//# sourceMappingURL=envelope.d.ts.map