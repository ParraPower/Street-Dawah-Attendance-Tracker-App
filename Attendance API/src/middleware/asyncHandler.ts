import { NextFunction, Response } from "express";
import { RequestWithUser } from "./requestWithUser";

export const asyncHandler = (fn: (req: RequestWithUser, res: Response, next: NextFunction) => any) => (req: RequestWithUser, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
