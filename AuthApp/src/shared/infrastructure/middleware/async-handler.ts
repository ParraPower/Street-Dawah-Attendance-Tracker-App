// import { Response, NextFunction } from 'express';
// import { RequestWithUser } from "@/core/requests/request-with-user";
import { DawahRequestHandler } from '@/core/requests/dawah-request-handler';

// const asyncHandler = (fn: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<void>) => {
//   return (req: RequestWithUser, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req as RequestWithUser, res, next)).catch(next);
//   };
// };

// export default asyncHandler;

export const asyncHandler =
  (fn: DawahRequestHandler): DawahRequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((err) => { console.log("next called", err.message); next(err) });