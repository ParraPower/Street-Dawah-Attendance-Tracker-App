import { Response, NextFunction } from 'express';
import { RequestWithUser } from "@/modules/auth/auth-middleware";

const asyncHandler = (fn: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as RequestWithUser, res, next)).catch(next);
  };
};

export default asyncHandler;