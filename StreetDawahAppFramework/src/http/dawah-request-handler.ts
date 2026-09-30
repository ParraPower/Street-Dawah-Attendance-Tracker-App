import { NextFunction } from 'express';
import { RequestWithUser } from './request-with-user';

export type DawahRequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any | { error: string },
  ReqQuery = any
> = (
  req: RequestWithUser<P, ResBody, ReqBody, ReqQuery>,
  res: any,
  next: NextFunction
) => unknown;
