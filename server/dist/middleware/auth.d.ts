import type { NextFunction, Request, Response } from "express";
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const getDbUserFromReq: (req: Request) => Promise<import("mongoose").Document<unknown, {}, import("../types/types.js").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../types/types.js").UserDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map