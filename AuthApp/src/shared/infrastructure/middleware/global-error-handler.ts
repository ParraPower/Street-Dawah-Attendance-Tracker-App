import { NextFunction, Response } from "express";

abstract class GlobalError {
  constructor(message: string)
  constructor(message: string, data?: object)

  constructor(message: string, data?: object) {
    this.message = message
    this.data = data
  }
  
  data?: object
  message!: string 
}

export class ValidationError extends GlobalError {
}

export class NotFoundError extends GlobalError {
}

export class UnauthorizedError extends GlobalError {
}

export class ConflictError extends GlobalError {
}


export function globalErrorHandler(err: GlobalError, req: any, res: Response, next: NextFunction) {
  console.log("I got to global error handling")
  // Domain errors → HTTP mapping
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

  // Unexpected errors
  //console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}