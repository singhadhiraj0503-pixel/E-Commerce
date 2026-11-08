import type { NextFunction, Request, Response } from "express";
export declare function asyncHandler(func: (req: Request, res: Response, next: NextFunction) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=asyncHandler.d.ts.map