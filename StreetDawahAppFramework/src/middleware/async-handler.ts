import { DawahRequestHandler } from '../http/dawah-request-handler';

export const asyncHandler =
  (fn: DawahRequestHandler): DawahRequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
