import { ConflictError, GlobalError, NotFoundError, UnauthorizedError, ValidationError } from '../errors/types';
import { NextFunction, Response } from 'express';

export function globalErrorHandler(
  err: GlobalError,
  req: any,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message, data: err.data });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
}
