import { RequestHandler } from 'express';
import { DawahRequestHandler } from '../http/dawah-request-handler';
import { RequestWithUser } from '../http/request-with-user';

export const asyncHandler =
  (fn: DawahRequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req as RequestWithUser, res, next)).catch(next);
