import type { NextFunction, Request, Response } from "express";

export function asyncHandler(
  func: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
}
